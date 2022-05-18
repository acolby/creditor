const fs = require("fs");
const utils_renderTemplate = require("#src/utils/renderTemplate/index.js");
const utils_normalizePath = require("#src/utils/normalizePath/index.js");

async function actions_create(options, { template, name }) {
  const templateOptions = options.templates[template];
  const files = {};
  if (!templateOptions || !templateOptions.files) return { files };
  templateOptions.files.forEach((file) => {
    const templatePath = options.path_templates + utils_normalizePath(`/${template}/${file}`);
    const rawTemplate = fs.readFileSync(templatePath, "utf8");
    files[utils_normalizePath(`${template}/`) + name + utils_normalizePath(`/${file}`)] = utils_renderTemplate(
      rawTemplate,
      utils_normalizePath(`${template}/`) + name
    );
  });
  console.log("🚀 ~ file: index.js ~ line 20 ~ actions_create ~ files", files)

  return { files };
}
  

module.exports = actions_create;
