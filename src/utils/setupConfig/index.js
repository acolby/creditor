const fs_directoryTree = require('@src/fs/directoryTree/index.js');

function utils_setupConfig(options) {
   
  const config = {};
  config.templates = _templateConfigs(options.path_templates);

  return {
    ...config,
    ...options,
  }
}

module.exports = utils_setupConfig;

function _templateConfigs(path) {

  const dirTree = fs_directoryTree(path);
  return (dirTree.children || [])
    .reduce((acc, item) => {
      // TODO load aggregators
      if (item.type === 'directory') {
        acc[`${item.name}`] = {
          type: item.name,
          templates: (item.children || [])
            .filter(item => item.type === 'file')
            .map((child) => { return { location: `${child.path}`, name: child.name, }; }),
        } 
      }
      return acc;
    }, {});

}
