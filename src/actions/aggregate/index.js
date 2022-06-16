const utils_renderAggregator = require("#src/utils/renderAggregator/index.js");

async function actions_aggregate(options, { template }) {
  const aggregatorOptions = options.aggregators[template];
  const files = {};
  if (!aggregatorOptions || !aggregatorOptions.files) return { files };
  aggregatorOptions.files.forEach((file) => {
    const aggregatorPath = `${options.path_aggregators}/${template}/${file}`;
    const aggregator = require(aggregatorPath);
    files[`${template}/${file}`] = utils_renderAggregator(
      aggregator,
      template,
      options.package
    );
  });

  return { files };
}

module.exports = actions_aggregate;
