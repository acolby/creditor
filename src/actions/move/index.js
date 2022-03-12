const utils_replaceUsage = require('#src/utils/replaceUsage/index.js');
const fs_readFile = require('#src/fs/readFile/index.js');

async function actions_move({ package, path_src, templates }, { template, name, name_to }) {
  const files = { toCreate: {}, toUpdate: {}, toDelete: {} };

  const usage_from = `${template}/${name}`;
  const usage_to = `${template}/${name_to}`;

  // 1.) find all usages that match the 
  const usagesToReplaceMap = {};
  Object.keys(package.uses)
  .forEach((usage) => {
    if (usage.indexOf(usage_from) === 0) {
      usagesToReplaceMap[usage] = `${usage_to}${usage.split(usage_from)[1]}`;
    }
  });

  // 2.) find all relivant locations that require updating
  await Promise.all(Object.keys(usagesToReplaceMap)
    .map(async (usage) => {

      // 2.a create the desired files and delete the old ones
      await Promise.all(
        Object.keys(package.usesInFiles[usage] || {})
        .map(async (fileName) => {
          const contents = await fs_readFile(`${path_src}/${usage}/${fileName}`);
          files.toCreate[`${usagesToReplaceMap[usage]}/${fileName}`] = utils_replaceUsage({ templates }, contents, usagesToReplaceMap);
          files.toDelete[`${usage}/${fileName}`] = true;
        })
      )

      // 2.b update all other files that are using the pattern
      const usedBy = package.usedBy[usage];
      if (usedBy) {
        await Promise.all(
          Object.keys(usedBy)
          .map(async (usedByUsage) => {
            if (usedByUsage.indexOf(usage_from) === 0) return;
            await Promise.all(
              Object.keys(package.usesInFiles[usedByUsage])
              .map(async (fileName) => {
                if (!package.usesInFiles[usedByUsage][fileName][usage]) return;
                const contents = await fs_readFile(`${path_src}/${usedByUsage}/${fileName}`);
                files.toUpdate[`${usedByUsage}/${fileName}`] = utils_replaceUsage({ templates }, contents, usagesToReplaceMap);
              })
            );
          })
        )
      }
    })
  )

  return { files };
}

module.exports = actions_move;
