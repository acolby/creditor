module.exports = (package) => {

  const filtered = Object.keys(package.uses)
    .filter(item => item.split('/').length === 2)
    .sort();

  const _exports = filtered
    .map(item => `export { ${item.replace(/\//g, '_')} } from '#src/${item}';`)

  return ['', ..._exports, ''].join('\n');
};
