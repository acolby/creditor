const path = require('path');

const utils_loadTemplates = require('#src/utils/loadTemplates/index.js');
const utils_analyzeSrc = require('#src/utils/analyzeSrc');
// const utils_setupConfig = require('./utils/setupConfig');

const actions_create = require('#src/actions/create');
// const actions_move = require('#src/actions/move');

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
  options.package = await utils_analyzeSrc(options);

  // console.log('options', options);

  return {
    options,
  }
}

module.exports = creditor;
