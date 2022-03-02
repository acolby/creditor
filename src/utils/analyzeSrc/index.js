const fs_directoryTree = require('#src/fs/directoryTree/index.js');
const fs_processLineByLine = require('#src/fs/processLineByLine/index.js');
const utils_analyzeSrc_parsePatternUsage = require('#src/utils/analyzeSrc/parsePatternUsage/index.js');

const readline = require('readline');
const fs = require('fs');

async function utils_analyzeSrc({ path_src, templates }) {

  const allfiles = (await fs_directoryTree(path_src)).map(location => location.split(path_src)[1]);

  allfiles
  .forEach((filePath) => {
    fs_processLineByLine(`${path_src}${filePath}`, (line, lineNumber) => {
      const usage = utils_analyzeSrc_parsePatternUsage({ templates }, line);
      if (usage) {
        console.log(usage);
      }
    })
  })
  
}

module.exports = utils_analyzeSrc;

// Creating a readable stream from file
// readline module reads line by line 
// but from a readable stream only.
