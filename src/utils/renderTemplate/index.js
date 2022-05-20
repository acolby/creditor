const path = require("path");
var os = require('os')
const eol = (os.EOL)

const delimiters = {
  CREDITOR_UNDERSCORE_NAME: "_",
  CREDITOR_PERIOD_NAME: ".",
  CREDITOR_DASH_NAME: "-",
  CREDITOR_SLASH_NAME: "/",
};

function utils_renderTemplate(template, usage) {
  return template
    .split(eol)
    .map((line) => {
      let rendered = line;
      //does the line contain a delimeter?
      while (rendered.indexOf("CREDITOR_") > 0) {
        const delimitorKey = Object.keys(delimiters).find((delimitorKey) => {
          return rendered.indexOf(delimitorKey) > -1;
        });
        //If yes, replace the path seperator ('/', or '\\') with the delimiter
        if (delimitorKey) {
          const delimitor = delimiters[delimitorKey];

          rendered = rendered.replace(
            delimitorKey,
            usage.split(path.sep).join(delimitor)
          );
        } else {
          // console.log('warning: line', line, 'does not porperly use CREDITOR_');
          break;
        }
      }
      return rendered;
    })
    .join(eol);
}

module.exports = utils_renderTemplate;
