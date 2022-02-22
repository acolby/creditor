const fs_directoryTree = require('#src/fs/directoryTree/index.js')

async function utils_analyzePackage({ path_src }) {

  const tree = await fs_directoryTree(path_src);
  console.log("tree", tree);

  return tree.map(location => location.split(path_src)[1]);
}

module.exports = utils_analyzePackage;