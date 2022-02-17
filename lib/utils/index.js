const fs = require('../fs');
const pluralize = require('pluralize');

async function renderPattern(config, pattern, location, name) {
  const templates = config.patterns[pattern].templates;
  const plural =  config.patterns[pattern].plural;

  const templateStrings = await Promise.all(
    templates.map(template => fs.readFile(template.location))
  );

  return templates
    .map((template, index) => {
      const path = `${config.output}/${plural}${location}/${name}/${template.name}`.replace(/\/{2,}/g, '/');
      let contents = templateStrings[index].replace(/<%= name %>/gm, `${plural}/${location}/${name}`.replace(/\/{2,}/g, '/').replace(/\//g, '_'))
        .replace(/<%= short_name %>/gm, `${name}`);

      return {
        action: 'create',
        path,
        contents,
      };
    });
}

async function moveItems(config, plural, mvSrc, mvDest) {
    
  const analysis = config._analysis;
  const srcBase = `/${plural}${mvSrc}`;

  const toWrite = [];

  // Structure the analysis so that it's easier to use
  const { usageToModify, itemsToModify } = Object.keys(analysis.byPath || {})
    .reduce((acc, path) => {
      if (path.indexOf(srcBase) !== 0) return acc;
      const destPath = `${mvDest}${path.split(mvSrc).slice(1, 10).join(mvSrc)}`;
      acc.usageToModify[analysis.byPath[path].usage] = {
        to: `${config.patterns[config._pluralToPattern[plural]].usage}${destPath}`.slice(0, -1).replace(/\//g, '.'),
      };
      acc.itemsToModify[path] = {
        nameFrom: `${path}`.slice(1, -1).replace(/\//g, '_'),
        nameTo: `${plural}${destPath}`.slice(0, -1).replace(/\//g, '_'),
        dest: `${plural}${destPath}`.slice(0, -1),
      };
      return acc;
    }, { usageToModify: {}, itemsToModify: {} });

  // For each of the src items
  await Promise.all(
    Object.keys(itemsToModify || {})
      .map((srcRel) => {
        const itemToModify = itemsToModify[srcRel];
        const srcBase = `${config.output}${srcRel}`;
        const destBase = `${config.output}/${itemToModify.dest}`;

      
        const files = (fs.readdirSync(srcBase) || [])
          .filter(item => item.indexOf('.') > 0);

        return Promise.all(
          files.map((file) => {
            return fs.readFile(`${srcBase}${file}`)
              .then((contents) => {
                const renderedContents = replaceUsage(contents.replace((new RegExp(`${itemToModify.nameFrom}`, 'g')), itemToModify.nameTo));
                toWrite.push({
                  action: 'create',
                  path: `${destBase}/${file}`,
                  contents: renderedContents,
                });
              });
          })
        );
      })
  );

  // for each usage to modify
  const filesToUpdate = {};
  Object.keys(usageToModify || {})
    .map((usage) => {
      const usedBy = analysis.isUsedBy[usage] || {};
      Object.keys(usedBy)
        .forEach((path) => {
          filesToUpdate[path] = true;
        });
    });

  await Promise.all(
    Object.keys(filesToUpdate)
      .filter(path => path.indexOf(`${config.rel}${srcBase}`) !== 0 )
      .map((path) => {
        return fs.readFile(`${config.cwd}${path}`)
          .then((contents) => {
            const renderedContents = replaceUsage(contents, analysis.fileUses[path]);
            toWrite.push({
              action: 'update',
              path: `${config.cwd}${path}`,
              contents: renderedContents,
            });
          });
      })
  );

  // delete directory with components
  toWrite.push({
    action: 'delete',
    path: `${config.output}${srcBase}`,
  });

  return toWrite;

  // Use the usage Map to modify the usage in the given contents
  function replaceUsage(contents, items = []) {
    let toReturn = contents;
    const toConsider = items.length || Object.keys(usageToModify || {});
    toConsider
      .filter(item => usageToModify[item])
      .sort((a, b) => { return b.length - a.length; })
      .forEach((toReplace) => {
        toReturn = toReturn.replace((new RegExp(`${toReplace}([^a-zA-Z])`, 'g')), `${usageToModify[toReplace].to}$1`);
      });
    return toReturn;
  }
}

function templateConfigs(path, prefix = '', toReturn = {}) {

  const dirTree = fs.directoryTree(path);
  (dirTree.children || [])
    .forEach((item) => {
      if (item.type === 'directory') {
        toReturn[`${prefix.length && `${prefix}:` || ''}${item.name}`] = (item.children || [])
          .filter(item => item.type === 'file')
          .map((child) => { return { location: `${child.path}`, name: child.name, }; });
        if (!prefix.length) templateConfigs(`${path}/${item.name}`, item.name, toReturn);
      }
    }, {});

  return toReturn;
}

function buildConfig() {

  const config = require(`${process.cwd()}/creditor/config.js`);

  config.cwd = process.cwd();
  config.rel = config.rel || '/src';
  config.output = `${config.cwd}${config.rel || '/src'}`;
  const templates = templateConfigs(`${process.cwd()}/creditor/templates`);

  config.patterns = config.templates || config.patterns || {};

  Object.keys(templates || {}).forEach((pattern) => {

    config.patterns[pattern] = config.patterns[pattern] || {};

    const type = pattern.split(':')[0];
    const plural = pluralize(type, 3);
    const usage = config.patterns[pattern].usage || `${plural[0].toUpperCase()}${plural.slice(1, 50)}`;
    const entry = config.patterns[pattern].entry || `index.js`;

    config._answers = {}; // used when prompting

    config._pluralToPattern = { ...(config._pluralToPattern || {}), [plural]: type };
    config._usageToPattern = { ...(config._usageToPattern || {}), [usage]: type };
    config._pluralToUsage = { ...(config._pluralToUsage || {}), [plural]: usage };

    config.patterns[pattern] = {
      params: ['name'],
      type,
      usage,
      plural,
      entry,
      templates: templates[pattern],
    };
  });

  return config;
}


module.exports = {
  renderPattern,
  templateConfigs,
  buildConfig,
  moveItems,
};
