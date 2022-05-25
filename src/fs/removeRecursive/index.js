const fs = require("fs");

async function fs_removeRecursive(path) {
  let children = fs.readdirSync(path) || [];
  children = await Promise.all(
    children.map(async (child) => {
      if (
        fs.statSync(`${path}/${child}`.replace(/\/{2,}/g, "/")).isDirectory()
      ) {
        fs_removeRecursive(`${path}/${child}`.replace(/\/{2,}/g, "/"));
        return false;
      }
      fs.unlink(`${path}/${child}`.replace(/\/{2,}/g, "/"), () => {});
      return false;
    })
  );

  children = children.filter((item) => item);

  if (!children.length) {
    await new Promise((resolve) =>
      fs.rmdir(`${path}`.replace(/\/{2,}/g, "/"), resolve)
    );
  }
}

module.exports = fs_removeRecursive;
