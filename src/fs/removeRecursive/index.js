const fs = require("fs");
const path = require('path')

async function fs_removeRecursive(dirPath) {
  let children = fs.readdirSync(dirPath) || [];
  children = await Promise.all(
    children.map(async (child) => {

      if (
        fs.statSync((dirPath + path.sep + child).replace(/\/{2,}/g, path.sep)).isDirectory()
      ) {
        fs_removeRecursive((dirPath + path.sep + child).replace(/\/{2,}/g, path.sep));
        return false;
      }
      fs.unlink((dirPath + path.sep + child).replace(/\/{2,}/g, path.sep), () => {});
      return false;
    })
  );

  children = children.filter((item) => item);

  if (!children.length) {
    await new Promise((resolve) =>
      fs.rmdir(`${dirPath}`.replace(/\/{2,}/g, path.sep), resolve)
    );
  }
}

module.exports = fs_removeRecursive;
