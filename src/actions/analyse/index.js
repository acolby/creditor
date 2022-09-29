async function actions_analyse(options) {
  const package = options.package;
  const files = { toCreate: {}, toUpdate: {}, toDelete: {} };

  files.toCreate[`${usagesToReplaceMap[usage]}/${fileName}`] =
    utils_replaceUsage({ templates }, contents, usagesToReplaceMap);
}

module.exports = actions_analyse;
