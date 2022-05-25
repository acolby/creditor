const parsePatternUsage = require("#src/utils/parsePatternUsage/index.js");

function utils_replaceUsage({ templates }, given, usageReplaceMap) {
  return given
    .split("\n")
    .map((line) => {
      const verboseUsages = parsePatternUsage({ templates }, line, true).sort(
        (itemA, itemB) => itemB.col_start - itemA.col_start
      );

      verboseUsages.forEach((verboseUsage) => {
        if (usageReplaceMap[verboseUsage.usage]) {
          const delimited = usageReplaceMap[verboseUsage.usage]
            .split("/")
            .join(verboseUsage.delimiter);
          line = `${line.slice(
            0,
            verboseUsage.col_start
          )}${delimited}${line.slice(verboseUsage.col_end)}`;
        }
      });

      return line;
    })
    .join("\n");
}

module.exports = utils_replaceUsage;
