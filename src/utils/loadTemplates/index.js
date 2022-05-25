const fs = require("fs");
const path = require("path");
const slash = require('slash')


function utils_loadTemplates({ path_templates }) {
  let templateNames;
  try {
    templateNames = fs.readdirSync(path_templates);
  } catch (e) {
    throw new Error(`Could not find any templates at ${path_templates}`);
  }

  return templateNames.reduce((acc, name) => {
    acc[name] = {
      name: name,
      path: slash(path.join(path_templates, name)),
      files: fs.readdirSync(path.join(path_templates, name)),
    };
    return acc;
  }, {});
}

module.exports = utils_loadTemplates;
