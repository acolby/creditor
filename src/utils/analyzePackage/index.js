const fs_directoryTree = require('#src/fs/directoryTree/index.js')

async function utils_analyzePackage({ path_src }) {

  const tree = await fs_directoryTree(path_src)






  return tree;
}

module.exports = utils_analyzePackage;