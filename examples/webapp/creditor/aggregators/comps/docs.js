var os = require('os')
const eol = (os.EOL)
const path = require('path')
const slash = require('slash')
module.exports = ({ paths = [] }) => {

  const filtered = paths
    .filter(item => item.split(path.sep).length === 2)
    .sort();
  
  const _exports = filtered
    .map(item => {
      const importPath = slash(`#src/${item}`);
      return `export { ${item.split(path.sep).join('_')} } from '${importPath}';`});  //incorporate path.sep

  return ['', ..._exports, ''].join(eol);

};
