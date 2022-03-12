
async function actions_move({ package }, { template, name, name_to }) {
  const files = { toCreate: {}, toUpdate: {}, toDelete: {} };

  const usage_from = `${template}/${name}`;
  const usage_to = `${template}/${name_to}`;

  console.log(usage_from, usage_to, package);
  // 1.) find all usages that match the 
  const usages_to_replace_map = {};
  Object.keys(package.uses)
  .forEach((usage) => {
    if (usage.indexOf(usage_from) === 0) {
      usages_to_replace_map[usage] = `${usage_to}${usage.split(usage_from)[1]}`;
    }
  });

  // 2. create the templates that correspond to found items
  Object.keys(usages_to_replace_map)
  .forEach((usage) => {
    
  })

  const replace_in_patterns = {};

  // console.log('---', usages_to_replace_map);

  // for each of the found usages cre
  const usages_replacement = {}

  // go over used buy updating all templates accordingly

  return files;
}

module.exports = actions_move;
