const fs = require("fs");
const path = require("path");

function utils_loadTemplates({ path_aggregators }) {
  let aggregatorNames = [];
  try {
    aggregatorNames = fs.readdirSync(path_aggregators);
  } catch (e) {}

  return aggregatorNames.reduce((acc, name) => {
    acc[name] = {
      name: name,
      path: path.join(path_aggregators, name),
      files: fs.readdirSync(path.join(path_aggregators, name)),
    };
    return acc;
  }, {});
}

module.exports = utils_loadTemplates;
