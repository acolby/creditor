const path = require('path');
const fs_directoryTree = require('#src/fs/directoryTree/index.js');
// const utils_setupConfig = require('./utils/setupConfig');
// const utils_analyzePackage = require('./utils/analyzePackage');

const defaults = {
  path_base: process.cwd(), // location of pactage json

  // OPTIONAL
  rel_templates: '/creditor/templates', // default
  rel_src: '/src', //default
};

async function creditor(given = {}) {
  const options = { ...defaults, ...given };

  // load templates

  options.path_src = path.join(options.path_base, options.rel_src);

  // const config = require(`${process.cwd()}/creditor/config.js`);
  // config.cwd = process.cwd();

  // const config = utils_setupConfig(options);
  // const package = utils_analyzePackage(config);

  console.log('---', options)
  const files = await fs_directoryTree(options.path_src);


  console.log(files);
}

module.exports = creditor;
