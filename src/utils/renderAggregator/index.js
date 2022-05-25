function utils_renderAggregator(aggregator, template, package) {
  return aggregator({
    paths: Object.keys(package.uses || {})
      .filter((item) => item.split("/")[0] === template)
      .sort(),
  });
}

module.exports = utils_renderAggregator;
