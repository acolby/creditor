const path = require("path");
const fs = require("fs");

function fs_readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, contents) => {
      if (err) reject(err);
      resolve(contents);
    });
  });
}

module.exports = fs_readFile;
