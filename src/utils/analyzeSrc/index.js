const fs_directoryTree = require('#src/fs/directoryTree/index.js');
const fs_processLineByLine = require('#src/fs/processLineByLine/index.js');
const utils_analyzeSrc_parsePatternUsage = require('#src/utils/analyzeSrc/parsePatternUsage/index.js');

const readline = require('readline');
const fs = require('fs');

async function utils_analyzeSrc({ path_src, templates }) {

  const allfiles = (await fs_directoryTree(path_src)).map(location => location.split(`${path_src}/`)[1]);

  const folderMatches = {};

  await Promise.all(allfiles
    .map(async (filePath) => {
      const folderPath = filePath.split('/').slice(0, -1).join('/');
      folderMatches[folderPath] = folderMatches[folderPath] || [];
      const allMatches = [];
      await fs_processLineByLine(`${path_src}/${filePath}`, (line, lineNumber) => {
        const usage = utils_analyzeSrc_parsePatternUsage({ templates }, line);
        folderMatches[folderPath] = folderMatches[folderPath].concat(usage);
      });
    })
  );

  return _removeDooplicates(folderMatches);
  
}

module.exports = utils_analyzeSrc;

function _removeDooplicates(data) {
  return Object.entries(data).reduce((acc, [folderPath, matches]) => {
    acc[folderPath] = matches.filter((item, index) => {
      return index === matches.indexOf(item);
    })
    return acc;
  }, {});
}
