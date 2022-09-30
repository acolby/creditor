const path = require("path");

async function actions_analyse(options, { rel_output }) {
  const files = {};
  const analyse = options.package.graph;
  if (rel_output) {
    const path_output = path.normalize(`${rel_output}`);
    files[path_output] = JSON.stringify(analyse, null, 2);
  }
  return { files, analyse };
}

module.exports = actions_analyse;
