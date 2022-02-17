const fs = require('fs');

function directoryTree(path) {

  const name = path.replace(/\/{2,}/g, '/').split('/')[path.replace(/\/{2,}/g, '/').split('/').length - 1];

  const item = { path: path.replace(/\/{2,}/g, '/'), name };
  let stats;

  try { stats = fs.statSync(path); }
  catch (e) { return null; }

  if (stats.isFile()) {
    item.type = 'file';
  }
  else if (stats.isDirectory()) {
    const dirData = fs.readdirSync(path);
    item.children = (dirData || [])
      .map(child => directoryTree(`${path}/${child}`))
      .filter(e => !!e);
    item.type = 'directory';

  } else {
    return null;
  }
  return item;
}

function allDirectories(path, filter = (item) => { return item.type === 'directory'; }) {

  const tree = directoryTree(path);
  const paths = _tree(tree && (tree.length && tree || [tree]) || []).map(item => `/${item.split(path)[1]}/`.replace(/\/{2,}/g, '/'));

  return paths;

  function _tree(tree, paths = []) {
    tree.forEach((item) => {
      if (filter(item)) {
        paths.push(item.path.replace(/\/{2,}/g, '/'));
      }
      _tree(item.children || [], paths);
    });
    return paths;
  }
}

function contentsAt(path) {
  let dirData;
  try { 
    dirData = fs.readdirSync(path);
  } catch (e) {
    // Do nothing; 
  }
  return (dirData || []).filter(e => !!e);
}

async function removeRecursive(path) {
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

// Reads a nested file
function readFile(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function(err, contents) {
      resolve(contents);
    });
  });
}

// Writes a nested file
async function writeFile(path, contents) {
  const dirPart = path.split('/').slice(0, -1).join('/');

  // make the dir
  await mkdirRec(dirPart);
  return new Promise((resolve) => {
    fs.writeFile(path, contents, function (err) {
      if (err) throw err;
      resolve();
    });
  });

  async function mkdirRec(dir, at = 0) {
    const dirItems = dir.split('/').filter(item => item);
    if (dirItems.length < at) return;
    const atDir = `/${dirItems.slice(0, at + 1).join('/')}`;

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

module.exports = {
  ...fs,
  allDirectories,
  readFile,
  writeFile,
  directoryTree,
  contentsAt,
  removeRecursive,
};

