const path = require("path");
const fs = require("fs");

async function fs_writeFile(dir_path, contents) {
  dir_path = path.normalize(dir_path);
  const dirPart = dir_path.split(path.sep).slice(0, -1).join(path.sep);

  // make the dir
  await mkdirRec(dirPart);
  return new Promise((resolve) => {
    fs.writeFile(dir_path, contents, function (err) {
      if (err) throw err;
      resolve();
    });
  });

  async function mkdirRec(dir, at = 0) {
    const dirItems = dir.split(path.sep).filter((item) => item);
    if (dirItems.length < at) return;
    const atDir = dirItems.slice(0, at + 1).join(path.sep);

    const stats = await stat(atDir);
    if (stats && stats.isDirectory()) return mkdirRec(dir, at + 1);

    await mkdir(atDir);
    return mkdirRec(dir, at + 1);
  }

  async function stat(d_path) {
    return new Promise((resolve, reject) => {
      fs.stat(d_path, (err, stats) => {
        resolve(stats);
      });
    });
  }
  async function mkdir(d_path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(d_path, (err) => {
        resolve();
      });
    });
  }
}

module.exports = fs_writeFile;
