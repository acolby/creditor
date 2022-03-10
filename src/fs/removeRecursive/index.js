const fs = require('fs');

async function fs_removeRecursive(path) {
  let children = (fs.readdirSync(path) || []);
  children = children.filter((child) => {
    if (fs.statSync(`${path}/${child}`.replace(/\/{2,}/g, '/')).isDirectory()) {
      removeRecursive(`${path}/${child}`.replace(/\/{2,}/g, '/'));
      return false;
    }
    fs.unlink(`${path}/${child}`.replace(/\/{2,}/g, '/'), () => {});
    return false;
  });
  if (!children.length) {
    fs.rmdir(`${path}`.replace(/\/{2,}/g, '/'), () => {});
  }
}

module.exports = fs_removeRecursive;
