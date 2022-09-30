const utils_replaceUsage = require("#src/utils/replaceUsage/index.js");
const fs_readFile = require("#src/fs/readFile/index.js");

async function actions_remove({ templates }, { template, name }) {
  const files = {};

  const templateDefinition = templates[template];
  templateDefinition.files.forEach((fileName) => {
    files[`${template}/${name}/${fileName}`] = "";
  });

  return { files };
}

module.exports = actions_remove;
