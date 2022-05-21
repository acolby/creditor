const fs = require("fs");
const utils_renderTemplate = require("#src/utils/renderTemplate/index.js");
const path = require('path')
;

async function actions_create(options, { template, name }) {
  const templateOptions = options.templates[template];
  const files = {};
  if (!templateOptions || !templateOptions.files) return { files };
  templateOptions.files.forEach((file) => {
    const templatePath = options.path_templates + path.normalize(`/${template}/${file}`);
    const rawTemplate = fs.readFileSync(templatePath, "utf8");
    files[path.normalize(`${template}/`) + name + path.normalize(`/${file}`)] = utils_renderTemplate(
      rawTemplate,
      path.normalize(`${template}/`) + name
    );
  });

  return { files };
}
  

module.exports = actions_create;
