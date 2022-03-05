
function utils_parsePatternUsage({ path_templates }) {

  const templateNames = fs.readdirSync(path_templates);

  return templateNames.reduce((acc, templatename) => {
    acc[templatename] = {
      name: templatename,
      path: path.join(path_templates, templatename),
      files: fs.readdirSync(path.join(path_templates, templatename)),
    }
    return acc;
  }, { });
  
}

module.exports = utils_parsePatternUsage;