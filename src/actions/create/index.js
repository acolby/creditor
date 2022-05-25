const fs = require("fs");
const utils_renderTemplate = require("#src/utils/renderTemplate/index.js");

async function actions_create(options, { template, name }) {
  const templateOptions = options.templates[template];
  const files = {};
  if (!templateOptions || !templateOptions.files) return { files };
  templateOptions.files.forEach((file) => {
    const templatePath = `${options.path_templates}/${template}/${file}`;
    const rawTemplate = fs.readFileSync(templatePath, "utf8");
    files[`${template}/${name}/${file}`] = utils_renderTemplate(
      rawTemplate,
      `${template}/${name}`
    );
  });

  return { files };
}

module.exports = actions_create;
