const path = require("path");

const fs_directoryTree = require("#src/fs/directoryTree/index.js");
const fs_processLineByLine = require("#src/fs/processLineByLine/index.js");
const utils_parsePatternUsage = require("#src/utils/parsePatternUsage/index.js");


async function utils_analyzeSrc({ path_src, templates }) {

  const allfiles = (await fs_directoryTree(path_src)).map(
    (location) => path.relative(path_src, location)
  );

  const uses = {};
  const usedBy = {};
  const usesInFiles = {};

  await Promise.all(
    allfiles.map(async (filePath) => {
      const folderPath = path.parse(filePath).dir//filePath.split(path.sep).slice(0, -1).join(path.sep);
      const fileName = path.parse(filePath).base //filePath.split(path.sep).pop();

      usesInFiles[folderPath] = usesInFiles[folderPath] || {};
      uses[folderPath] = uses[folderPath] || {};

      usesInFiles[folderPath][fileName] = {};

      await fs_processLineByLine(path.join(path_src, filePath),(line, lineNumber) => {
          const usages = utils_parsePatternUsage({ templates }, line);
          usages.forEach((usage) => {
            if (usage === folderPath) return;
            uses[folderPath][usage] = true;
            usedBy[usage] = usedBy[usage] || {};
            usedBy[usage][folderPath] = true;
            usesInFiles[folderPath][fileName][usage] = true;
          });
        }
      );
    })
      
  );

  usesObj = {};

  Object.keys(uses).forEach((usage) => {
    segmentToObject(usesObj, usage);
  });

  function segmentToObject(output, segment = "") {
    const first = segment.split(path.sep)[0];
    const rest = segment.split(path.sep).slice(1);

    output[first] = output[first] || {};

    if (rest.length === 0) return;
    segmentToObject(output[first], rest.join(path.sep));
  }

  return {
    uses: uses,
    usedBy: usedBy,
    usesInFiles: usesInFiles,
    usesObj: usesObj,
  };
}

module.exports = utils_analyzeSrc;
