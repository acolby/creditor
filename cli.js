const { Command } = require('commander');
const fuzzy = require('fuzzy-filter');

const package = require('./package.json');
const creditor = require('./src');
const utils_prompt = require('./src/utils/prompt');


const program = new Command();

program
  .name('creditor')
  .description('CLI for scafolding code')
  .version(package.version);

program.command('inquire')
  .description('Have the command prop walk you through the runnning creditor')
  .option('--src', 'location of of your source code (default: "/src")')
  .option('--verbose', 'show additional information')
  .action(async (options) => {
    const instance = creditor({ rel_src: options.src, verbose: options.verbose });
    await instance.init();
    const prompts = _prompts();
    const answers = {}; // where the answers will be stored
    const analysis = { templates: instance.options.templates, package: instance.options.package };
    await utils_prompt('action', { prompts, answers, analysis});

    if (answers.action === 'create') {
      await instance.create({
        template: answers.template,
        name: answers.mkLoc,
      });
    } else if (answers.action === 'move') {
      await instance.move({
        template: answers.template,
        name: answers.mvSrc,
        name_to: answers.mvDest,
      });
    }
  });

program.command('create <destination>')
  .description('Create a template defined in you templates directory')
  .option('--src <rel_src>', 'location of of your source code (default: "/src")')
  .option('--verbose', 'show additional information')
  .action(async (location, options) => {
    const instance = creditor({ rel_src: options.src, verbose: options.verbose });
    try {
      await instance.init();
      await instance.create({
        template: location.split('/').filter(item => item)[0],
        name: location.split('/').filter(item => item).slice(1).join('/'),
      });
    } catch(e) {
      console.log('ERROR', e.message);
    }
  });

program.command('move <source> <destination>')
  .description('Move (recursively) an template defined in you templates directory')
  .option('--src', 'location of of your source code (default: "/src")')
  .option('--verbose', 'show additional information')
  .action(async (source, dest, options) => {
    const instance = creditor({ rel_src: options.src, verbose: options.verbose });
    const template_source = source.split('/').filter(item => item)[0];
    const template_dest = dest.split('/').filter(item => item)[0];
    if (template_source !== template_dest) {
      throw new Error(`the source template (${template_source}) is different than the destination template (${template_dest})`)
    }
    try {
      await instance.init();
      const files = await instance.move({
        template: template_source,
        name: source.split('/').filter(item => item).slice(1).join('/'),
        name_to: dest.split('/').filter(item => item).slice(1).join('/'),
      });
    } catch(e) {
      console.log('ERROR', e.message);
    }
  });

program.parse();

function _prompts() {
  return {
   action: (params) => {
     const { answers, promps, analysis } = params;
     return {
        type: 'list',
        name: 'action',
        message: 'What action would you like to perform?',
        choices: [
          'create',
          'move',
          'agregate',
          // 'analyze',
        ],
        nextPrompt() {
          if (answers.action === 'create' || answers.action === 'move') return 'template';
        },
        
      }
   },
   template: (params) => {
     const { answers, promps, analysis } = params;
     return {
        type: 'list',
        name: 'template',
        message: `What template would you like to ${answers.action}?`,
        choices: Object.keys(analysis.templates),
        nextPrompt() {
          if (answers.action === 'create') return 'mkLoc';
          if (answers.action === 'move') return 'mvSrc';
        },
      }
    },
    mkLoc: (params) => {
     const { answers, promps, analysis } = params;
     return {
        type: 'autocomplete',
        name: 'mkLoc',
        suggestOnly: true,
        message: `Where would you like to put the new "${answers.template}" within /${answers.template}/?`,
        source: async (_, input) => {
          return Promise.resolve(_fuzzySearchPath(input, answers.template, analysis));
        },
        validate: (input) => {
          if (!input) return 'This question is required';
          if (input !==  `${input || ''}`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/').split('/').filter(item => item).join('/')) return `${input} is not a valid directory of form some/nested/directory`;
          if (input === '/') return `Template can not be created at the top of the /${answers.template} directory`;
          if (analysis.package.uses[`${answers.template}/${input}`]) return `${input} already exists within /${answers.template}/`;
          return true;
        },
        nextPrompt() {},
      }
    },
    mvSrc: (params) => {
     const { answers, promps, analysis } = params;
     return {
        type: 'autocomplete',
        name: 'mvSrc',
        suggestOnly: true,
        message: `What directory would you like to move?`,
        source: async (_, input) => {
          return Promise.resolve(_fuzzySearchPath(input, answers.template, analysis));
        },
        validate: (input) => {
          if (!input) return 'This question is required';
          if (input !==  `${input || ''}`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/').split('/').filter(item => item).join('/')) return `${input} is not a valid directory of form some/nested/directory`;
          if (input === '/') return `You may not not move the root /${answers.template} directory`;
          if (!analysis.package.uses[`${answers.template}/${input}`]) return `${input} is not an existing directory`;
          return true;
        },
        nextPrompt() {
          return 'mvDest';
        },
      }
    },
    mvDest: (params) => {
     const { answers, promps, analysis } = params;
     return {
        type: 'autocomplete',
        name: 'mvDest',
        suggestOnly: true,
        message: `Where would you like to move this directory?`,
        source: async (_, input) => {
          return Promise.resolve(_fuzzySearchPath(input, answers.template, analysis));
        },
        validate: (input) => {
          if (!input) return 'This question is required';
          if (input !==  `${input || ''}`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/').split('/').filter(item => item).join('/')) return `${input} is not a valid directory of form some/nested/directory`;
          return true;
        },
        nextPrompt() {},
      }
    },
  };
}

function _fuzzySearchPath(input, template, analysis) {
  const sanitized = (`${input || ''}`.replace(/[^a-zA-Z/]/g, '').replace(/\/{2,}/g, '/'));
          
  // default uses by is template
  let usesBy = analysis.package.usesObj[template];

  const segments = sanitized.split('/').slice(0, -1);
  segments
  .forEach((item) => {
    usesBy = usesBy[item] || {}
  });
  const prefix = segments.join('/');
  const suggestions = Object.keys(usesBy || {}).map(item => `${prefix}${prefix && '/' || ''}${item}/`)
  const results = fuzzy(sanitized, suggestions || []).sort((a, b) => { return a.length - b.length; });
  return [sanitized, ...results];
}
