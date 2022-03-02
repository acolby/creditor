
function utils_analyzeSrc_parsePatternUsage({ templates }, string) {

  const delimeters = {
    '_': true,
    '/': true,
    '.': true,
    '-': true,
  };

  const terminators = [ '/index', '(', ' ', '\'', '"', '`', '  ', '\n' ];

  // one pattern per line for now
  let match = null;
  Object.keys(templates)
  .forEach((templatesName) => {
    const col_start = string.indexOf(templatesName);
    // console.log('col_start', templatesName, string, col_start)

    if (col_start > 0) {
      let col_end = templatesName.length + col_start;
      const delimeter = string[col_end];

      if (!delimeters[delimeter]) return;

      const substirng = string.slice(col_end);
      terminators.forEach((terminator) => {
        const loc = substirng.indexOf(terminator);
        if (loc > -1 && loc < col_end) col_end = loc
      });

      match = `${templatesName}${substirng.slice(0, col_end)}`.split(delimeter).join('/')
    }
  });
  return match;
}

module.exports = utils_analyzeSrc_parsePatternUsage;
