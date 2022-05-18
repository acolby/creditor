const path = require("path")

function utils_renderAggregator(aggregator, template, package) {
  return aggregator({
    paths: Object.keys(package.uses || {})
      .filter((item) => item.split(path.sep)[0] === template)
      .sort(),
  });
}

module.exports = utils_renderAggregator;
