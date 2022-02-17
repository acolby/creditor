const inquirer = require('inquirer');
const fuzzy = require('fuzzy-filter');
const lib = require('./');

// inquirer plugins
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = (config, answers = {}) => {
  return {
    action: () => {
      return {
        type: 'list',
        name: 'action',
        choices: ['create', 'move', 'analyze'],
        message: 'What action would you like to do?',
      };
    },
    pattern: () => {
      return {
        type: 'list',
        name: 'pattern',
        choices: Object.keys(config.patterns),
        message: `What template would you like to ${answers.action}?`,
      };
    },
    plural: () => {
      return {
        type: 'list',
        name: 'plural',
        choices: Object.keys(Object.keys(config.patterns).reduce((acc, pattern) => { return { ...acc, [config.patterns[pattern].plural]: true }; }, {})),
        message: `What pattern would you like to ${answers.action}?`,
      };
    },
    location: () => {
      let options;
      return {
        type: 'autocomplete',
        name: 'location',
        suggestOnly: true,
        message: `Where whould you like to put it? ${`${config.rel}/${config.patterns[answers.pattern].plural}`.replace('//', '/')}`,
        default: '/',
        choices: [],
        source: async (_, input) => {
          if (!options) {
            options = lib.fs.allDirectories(`${config.output}/${config.patterns[answers.pattern].plural}`)
              .filter(item => item !== '/undefined/');
          }
          const curr = `/${input || ''}/`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/');

          const results = fuzzy(curr, options || []).sort((a, b) => { return a.length - b.length; });
          if (curr !== results[0]) results.unshift(curr);
          return Promise.resolve(results);
        },
        validate: (input, answer) => {
          if (input !==  `/${input || ''}/`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/')) return `${input} is not valid`;
          if (input) return true;
          return 'Must select a valid directory';
        },
      };
    },
    mvSrc: () => {
      let options;
      return {
        type: 'autocomplete',
        name: 'mvSrc',
        suggestOnly: true,
        message: `What directory would you like to move? ${config.rel}/${answers.plural}`,
        default: '/',
        choices: [],
        source: async (_, input) => {
          if (!options) {
            options = lib.fs.allDirectories(`${config.output}/${answers.plural}`);
          }
          const curr = `/${input || ''}/`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/');
          const results = fuzzy(curr, options || []).sort((a, b) => { return a.length - b.length; });
          return Promise.resolve(results);
        },
        validate: (input, answer) => {
          if (input !==  `/${input || ''}/`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/')) return `${input} is not valid`;
          if (input) return true;
          return 'Must select a valid directory';
        },
      };
    },
    mvDest: () => {
      let options;
      let srcItems;
      return {
        type: 'autocomplete',
        name: 'mvDest',
        suggestOnly: true,
        message: `Where would you like to put it? ${config.rel}/${answers.plural}`,
        default: '/',
        choices: [],
        source: async (_, input) => {

          if (!options) {
            srcItems = lib.fs.contentsAt(`${config.output}/${answers.plural}${answers.mvSrc}`).reduce((acc, curr) => { return { ...acc, [curr]: true }; }, {});
            options = lib.fs.allDirectories(
              `${config.output}/${answers.plura}`,
              (item) => {
                const found = (item.children || []).find(item => srcItems[item.name]);
                return item.type === 'directory' && !found;
              },
            );
          }

          const curr = `/${input || ''}/`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/');

          const results = fuzzy(curr, options || []).sort((a, b) => { return a.length - b.length; });
          if (curr !== results[0]) results.unshift(curr);
          return Promise.resolve(results);
        },
        validate: (input, answer) => {
          if (input !==  `/${input || ''}/`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/')) return `${input} is not valid`;
          const destItems = lib.fs.contentsAt(`${config.output}/${answers.plural}${input}`);
          const found = destItems.find(item => srcItems[item]);
          if (found) return `'${found}' exists in both source and destination directories`;
          if (input) return true;
        },
      };
    },
    item: () => {
      let options;
      return {
        type: 'autocomplete',
        name: 'item',
        suggestOnly: true,
        message: `What item? ${config.rel}/${config.patterns[answers.pattern].plural}`,
        default: '/',
        choices: [],
        source: async (_, input) => {
          if (!options) {
            options = lib.fs.allDirectories(
              `${config.output}/${config.patterns[answers.pattern].plural}`,
              item => item.name === 'index.js',
            )
              .map(item => item.split('/index.js/')[0])
              .filter(item => item.length > 2);
          }
          const curr = `/${input || ''}`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/');
          const results = fuzzy(curr, options || []).sort((a, b) => { return a.length - b.length; });
          return Promise.resolve(results);
        },
        validate: (input, answer) => {
          if (input !==  `/${input || ''}`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/')) return `${input} is not valid`;
          if (input) return true;
          return 'Must select a valid directory';
        },
      };
    },
    name: () => {
      return {
        type: 'input',
        name: 'name',
        message: 'What would you like to name it?',
        validate: (input) => {

          const options = lib.fs.allDirectories(
            `${config.output}/${config.patterns[answers.pattern].plural}${answers.location}`,
            item => item.name === 'index.js',
          )
            .map(item => item.split('/index.js')[0])
            .filter(item => item.split('/').length === 2)
            .map(item => item.replace(/\//g, ''))
            .reduce((acc, curr) => { return { ...acc, [curr]: true }; }, {});

          if (!input) return 'must provide a name';
          if (options[input]) return `${config.rel}/${config.patterns[answers.pattern].plural}${answers.location}${input} already exists`;

          return true;
        },
        transformer: (input) => {
          return input.replace(/[^a-zA-Z]/g, '');
        },
      };
    },
    areYouSure: () => {
      return {
        type: 'list',
        name: 'areYouSure',
        choices: ['no', 'yes'],
        message: 'Are you sure?',
        transformer: (input) => {
          return input === 'yes' && true || false;
        },
      };
    },
  };

};

