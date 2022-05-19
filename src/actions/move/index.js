const utils_replaceUsage = require("#src/utils/replaceUsage/index.js");
const fs_readFile = require("#src/fs/readFile/index.js");
const path = require("path");

async function actions_move(
  { package, path_src, path_templates, templates },
  { template, name, name_to }
) {
  const files = { toCreate: {}, toUpdate: {}, toDelete: {} };
  const templatesToUpdate = { toUpdate: {} };
  const usage_from = template + path.sep + name; //If templates takes a path rather than folder
  const usage_to = template + path.sep + name_to;     //must wrap template in pathNormalization

  // 1.) find all usages that match the
  const usagesToReplaceMap = {};
  Object.keys(package.uses).forEach((usage) => {
    if (usage.indexOf(usage_from) === 0) {
      usagesToReplaceMap[usage] = `${usage_to}${usage.split(usage_from)[1]}`;
    }
  });

  // 2.) find all relivant locations that require updating
  await Promise.all(
    Object.keys(usagesToReplaceMap).map(async (usage) => {
      // 2.a create the desired files and delete the old ones
      await Promise.all(
        Object.keys(package.usesInFiles[usage] || {}).map(async (fileName) => {
          const contents = await fs_readFile(
            path_src + path.sep + usage + path.sep + fileName
          );
          files.toCreate[usagesToReplaceMap[usage] + path.sep + fileName] =
            utils_replaceUsage({ templates }, contents, usagesToReplaceMap);
          files.toDelete[usage + path.sep + fileName ] = true;
        })
      );

      // 2.b update all other files that are using the pattern
      const usedBy = package.usedBy[usage];
      if (usedBy) {
        await Promise.all(
          Object.keys(usedBy).map(async (usedByUsage) => {
            if (usedByUsage.indexOf(usage_from) === 0) return;
            await Promise.all(
              Object.keys(package.usesInFiles[usedByUsage]).map(
                async (fileName) => {
                  if (!package.usesInFiles[usedByUsage][fileName][usage])
                    return;
                  const contents = await fs_readFile(
                    path_src + path.sep + usedByUsage + path.sep + fileName 
                  );
                  files.toUpdate[usedByUsage + path.sep + fileName] =
                    utils_replaceUsage(
                      { templates },
                      contents,
                      usagesToReplaceMap
                    );
                }
              )
            );
          })
        );
      }
    })
  );

  // 3. find template files that need to be updated
  const templateFiles = [];
  Object.entries(templates).forEach(([tempalte, templateDefinition]) => {
    templateDefinition.files.forEach((fileName) => {
      templateFiles.push(`${path_templates}/${tempalte}/${fileName}`);
    });
  });

  await Promise.all(
    templateFiles.map(async (filePath) => {
      const contents = await fs_readFile(filePath);
      const newContents = await utils_replaceUsage(
        { templates },
        contents,
        usagesToReplaceMap
      );
      if (contents !== newContents) {
        templatesToUpdate.toUpdate[filePath.split(`${path_templates}/`)[1]] =
          newContents;
      }
    })
  );

  return { files, templates: templatesToUpdate };
}

module.exports = actions_move;
