
const path = require('path');
const chalk = _chalktemp(); // require('chalk');
const fs_writeFile = require('#src/fs/writeFile/index.js');
const fs_removeRecursive = require('#src/fs/removeRecursive/index.js');

async function fs_commitFileObject({ toCreate = {}, toUpdate = {}, toDelete = {}, path_base, verbose = false}) {

  if (!path_base) new Error('base path was not passed in');

  const toWrite = [];
  
  Object.entries(toCreate)
  .forEach(([path, contents]) => {
    toWrite.push({
      action: 'create',
      contents,
      path,
    })
  });

  Object.entries(toUpdate)
  .forEach(([path, contents]) => {
    toWrite.push({
      action: 'update',
      contents,
      path,
    })
  });

  Object.entries(toDelete)
  .forEach(([path, contents]) => {
    toWrite.push({
      action: 'delete',
      contents,
      path,
    })
  });

  return Promise.all((toWrite || [])
    .map((toWrite) => {
      if (toWrite.action === 'create') {
        if (verbose) console.log(`${chalk.green('CREATE')} ${toWrite.path}`);
        return fs_writeFile(`${path_base}/${toWrite.path}`, toWrite.contents);
      }
      if (toWrite.action === 'update') {
        if (verbose) console.log(`${chalk.yellow('UPDATE')} ${toWrite.path}`);
        return fs_writeFile(`${path_base}/${toWrite.path}`, toWrite.contents);
      }
      if (toWrite.action === 'delete') {
        if (verbose) console.log(`${chalk.red('DELETE')} ${toWrite.path}`);
        return lib.fs.removeRecursive(`${path_base}/${toWrite.path}`);
      }
    }));

}

module.exports = fs_commitFileObject;

// TODO remove this with chalk module
function _chalktemp() {
  return {
    green: item => item,
    yello: item => item,
    red: item => item,
  }
}