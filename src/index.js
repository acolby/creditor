const fs_directoryTree = require('#src/fs/directoryTree/index.js');
// const utils_setupConfig = require('./utils/setupConfig');
// const utils_analyzePackage = require('./utils/analyzePackage');

const optionsDefault = {
  path_templates: '/creditor', // abs dir of template definitions
  path_src: '/src', // abs dir of src code
};

async function creditor(options = optionsDefault) {

  // const config = require(`${process.cwd()}/creditor/config.js`);
  // config.cwd = process.cwd();

  // const config = utils_setupConfig(options);
  // const package = utils_analyzePackage(config);
  const files = await fs_directoryTree(options.path_src);


  console.log(files);
}

module.exports = creditor;
