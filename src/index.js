const path = require('path');

const utils_loadTemplates = require('#src/utils/loadTemplates/index.js');
const utils_analyzePackage = require('./utils/analyzePackage');
// const utils_setupConfig = require('./utils/setupConfig');

const defaults = {
  path_base: process.cwd(), // location of pactage json

  // OPTIONAL
  rel_templates: '/creditor/templates', // default
  rel_src: '/src',
};

async function creditor(given = {}) {
  const options = { ...defaults, ...given };

  // load templates
  options.path_src = path.join(options.path_base, options.rel_src);
  options.path_templates = path.join(options.path_base, options.rel_templates);
  options.templates = utils_loadTemplates(options);
  options.package = await utils_analyzePackage(options);

  // const config = require(`${process.cwd()}/creditor/config.js`);
  // config.cwd = process.cwd();

  // const config = utils_setupConfig(options);
  // const package = utils_analyzePackage(config);

  console.log('---', options);
  // const files = await fs_directoryTree(options.path_src);
  // console.log(files);

  return {
    options,
  }
}

module.exports = creditor;
