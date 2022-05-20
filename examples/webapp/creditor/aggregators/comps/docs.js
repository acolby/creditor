var os = require('os')
const eol = (os.EOL)
const path = require('path')
module.exports = ({ paths = [] }) => {

  const filtered = paths
    .filter(item => item.split(path.sep).length === 2)
    .sort();

  const _exports = filtered
    .map(item => `export { ${item.replace(/\//g, '_')} } from '#src/${item}';`)  //incorporate path.sep

  return ['', ..._exports, ''].join(eol);

};
