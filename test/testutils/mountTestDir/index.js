const fs = require("fs");
const path = require("path");

var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

var mkdir = function (dir) {
  var exists = fs.existsSync(dir);
  var stats = exists && fs.statSync(dir);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    return;
  } else {
    fs.mkdirSync(dir);
  }
};

var deleteRecursiveSync = function (directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteRecursiveSync(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

const testutils_mountTestDir = () => {
  const base = process.cwd();
  const src = path.join(base, "/test/testdir");
  const dest = path.join(base, "/.temp/testdir");

  deleteRecursiveSync(dest);
  mkdir(path.join(base, "/.temp"));
  copyRecursiveSync(src, dest);

  return {
    path_base: dest,
  };
};

module.exports = testutils_mountTestDir;
