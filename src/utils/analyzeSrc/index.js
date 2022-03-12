const fs_directoryTree = require('#src/fs/directoryTree/index.js');
const fs_processLineByLine = require('#src/fs/processLineByLine/index.js');
const utils_parsePatternUsage = require('#src/utils/parsePatternUsage/index.js');

const readline = require('readline');
const fs = require('fs');

async function utils_analyzeSrc({ path_src, templates }) {

  const allfiles = (await fs_directoryTree(path_src)).map(location => location.split(`${path_src}/`)[1]);

  const uses = {};
  const usedBy = {};

  await Promise.all(allfiles
    .map(async (filePath) => {
      const folderPath = filePath.split('/').slice(0, -1).join('/');
      uses[folderPath] = uses[folderPath] || {};
      await fs_processLineByLine(`${path_src}/${filePath}`, (line, lineNumber) => {
        const usages = utils_parsePatternUsage({ templates }, line);
        usages.forEach((usage) => {
          if (usage === folderPath) return;
          uses[folderPath][usage] = true;
          usedBy[usage] = usedBy[usage] || {};
          usedBy[usage][folderPath] = true;
        });
      });
    })
  );

  return {
    uses: uses,
    usedBy: usedBy,
  };

}

module.exports = utils_analyzeSrc;
