const { Command } = require('commander');
const program = new Command();
const package = require('./package.json');
const creditor = require('./src');

program
  .name('creditor')
  .description('CLI for scafolding code')
  .version(package.version);

program.command('inquire')
  .description('Have the command prop walk you through the runnning creditor')
  .option('--src', 'location of of your source code (default: "/src")')
  .action(() => {
    console.log('open inquierer');
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