const fs = require('fs');
const path = require('path');

const delimiters = {
  'CREDITOR_UNDERSCORE_NAME': '_',
  'CREDITOR_PERIOD_NAME': '.',
  'CREDITOR_DASH_NAME': '-',
  'CREDITOR_SLASH_NAME': '/',
};

function utils_renderTemplate(template, usage) {
  return template.split('\n')
    .map((line) => {
      let rendered = line;
      while (rendered.indexOf('CREDITOR_') > 0) {
        const delimitorKey = Object.keys(delimiters).find((delimitorKey) => {
          return rendered.indexOf(delimitorKey) > -1;
        });
        if (delimitorKey) {
          const delimitor = delimiters[delimitorKey];
          rendered = rendered.replace(delimitorKey, usage.replace(/\//g, delimitor))
        } else {
          console.log('warning: line', line, 'does not porperly use CREDITOR_');
          break;
        }
      }
      return rendered;
    }).join('\n');
}

module.exports = utils_renderTemplate;
