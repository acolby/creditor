const path = require('path');

const utils_loadTemplates = require('#src/utils/loadTemplates/index.js');
const utils_analyzeSrc = require('#src/utils/analyzeSrc/index.js');
// const utils_setupConfig = require('./utils/setupConfig');

const actions_create = require('#src/actions/create/index.js');
// const actions_move = require('#src/actions/move');

const defaults = {
  path_base: process.cwd(), // location of pactage json

  // OPTIONAL
  rel_templates: '/creditor/templates', // default
  rel_src: '/src',
};

function creditor(given = {}) {
  const options = { ...defaults, ...given };
  let isInit = false;
 

  return {
    async init() {
       // load templates
       options.path_src = path.join(options.path_base, options.rel_src);
       options.path_templates = path.join(options.path_base, options.rel_templates);
       options.templates = utils_loadTemplates(options);
       options.package = await utils_analyzeSrc(options);

       isInit = true;
       return options;
    },
    async create() {
      
    },
    async move() {
      
    }
  }
}

module.exports = creditor;
