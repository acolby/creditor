const promisify = require("util").promisify;
const path = require("path");
const fs = require("fs");
const readdirp = promisify(fs.readdir);
const statp = promisify(fs.stat);
const slash = require('slash')


async function fs_directoryTree(directoryName, results = []) {
  let files;
  try {
    files = await readdirp(path.normalize(directoryName));
  } catch (e) {
    return [];
  }

  for (let f of files) {
    let fullPath = path.join(directoryName, f);
    let stat = await statp(fullPath);
    if (stat.isDirectory()) {
      await fs_directoryTree(fullPath, results);
    } else {
      results.push(slash(fullPath));
    }
  }
  return results;
}

module.exports = fs_directoryTree;
