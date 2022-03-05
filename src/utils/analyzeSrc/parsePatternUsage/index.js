
function utils_analyzeSrc_parsePatternUsage({ templates }, string, matches = []) {

  const delimeters = {
    '_': true,
    '/': true,
    '.': true,
    '-': true,
  };

  const terminators = {
    '(': true,
    ' ': true,
    '\'': true,
    '"': true,
    '`': true,
    '  ': true,
    '\n': true,
    '}': true,
    '\r': true,
    '.': true,
    ';': true,
  };

  // one pattern per line for now
  let match = null;
  Object.keys(templates)
  .forEach((templatesName) => {
    const col_start = string.indexOf(templatesName);
    const delimeter = string[col_start + templatesName.length];
    // console.log('col_start', templatesName, string, col_start)

    if (col_start > 0 && delimeters[delimeter]) {
      // pattern was found
      let col_end = col_start;
      let terminator = false;
      while (!terminator && string[col_end]) {
        col_end++;
        const char = string[col_end];
        terminator = (terminators[char] && char !== delimeter) && char;
      }

      const items = `${string.slice(col_start, col_end)}`.split(delimeter);
      if (delimeter === '/' && terminator  === '.') {
        items.pop();
      }

      matches.push(items.join('/'));

      if (!!string[col_end]) {
        utils_analyzeSrc_parsePatternUsage({ templates }, string.slice(col_end), matches)
      }
    }
  });

  return matches;
}

module.exports = utils_analyzeSrc_parsePatternUsage;
