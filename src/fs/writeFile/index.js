const path = require("path");
const fs = require("fs");

async function fs_writeFile(path, contents) {
  const dirPart = path.split("/").slice(0, -1).join("/");

  // make the dir
  await mkdirRec(dirPart);
  return new Promise((resolve) => {
    fs.writeFile(path, contents, function (err) {
      if (err) throw err;
      resolve();
    });
  });

  async function mkdirRec(dir, at = 0) {
    const dirItems = dir.split("/").filter((item) => item);
    if (dirItems.length < at) return;
    const atDir = `/${dirItems.slice(0, at + 1).join("/")}`;

    const stats = await stat(atDir);
    if (stats && stats.isDirectory()) return mkdirRec(dir, at + 1);

    await mkdir(atDir);
    return mkdirRec(dir, at + 1);
  }

  async function stat(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        resolve(stats);
      });
    });
  }
  async function mkdir(path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, (err) => {
        resolve();
      });
    });
  }
}

module.exports = fs_writeFile;
