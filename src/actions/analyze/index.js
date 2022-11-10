const path = require("path");

async function actions_analyze(options, { rel_output }) {
  const files = {};
  const analyze = options.package.graph;
  if (rel_output) {
    const path_output = path.normalize(`${rel_output}`);
    files[path_output] = JSON.stringify(analyze, null, 2);
  }
  return { files, analyze };
}

module.exports = actions_analyze;
