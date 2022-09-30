function utils_parsePatternUsage(
  { templates },
  string,
  verbose = false,
  matches = [],
  col_offset = 0
) {
  const delimiters = {
    _: true,
    "/": true,
    ".": true,
    "-": true,
  };

  const terminators = {
    "(": true,
    ")": true,
    " ": true,
    "'": true,
    '"': true,
    "`": true,
    "\t": true,
    "\n": true,
    "{": true,
    "}": true,
    "\r": true,
    ".": true,
    ";": true,
    "<": true,
    ">": true,
    ",": true,
  };

  // one pattern per line for now
  let match = null;
  Object.keys(templates).forEach((templatesName) => {
    const col_start = string.indexOf(templatesName);
    const delimiter = string[col_start + templatesName.length];
    // console.log('col_start', templatesName, string, col_start)

    if (col_start > 0 && delimiters[delimiter]) {
      // pattern was found
      let col_end = col_start;
      let terminator = false;
      while (!terminator && string[col_end]) {
        col_end++;
        const char = string[col_end];

        if (char === delimiter && string[col_end + 1] === delimiter) {
          // terminate on double delimiter found
          terminator = `${delimiter}${delimiter}`;
        } else {
          terminator = terminators[char] && char !== delimiter && char;
        }
      }

      const items = `${string.slice(col_start, col_end)}`.split(delimiter);
      if (delimiter === "/" && terminator === ".") {
        const popped = items.pop();
        col_end -= popped.length + 1;
      }

      if (verbose) {
        matches.push({
          usage: items.join("/"),
          col_start: col_start + col_offset,
          col_end: col_end + col_offset,
          delimiter,
        });
      } else {
        matches.push(items.join("/"));
      }

      if (!!string[col_end]) {
        utils_parsePatternUsage(
          { templates },
          string.slice(col_end),
          verbose,
          matches,
          col_offset + col_end
        );
      }
    }
  });

  return matches;
}

module.exports = utils_parsePatternUsage;
