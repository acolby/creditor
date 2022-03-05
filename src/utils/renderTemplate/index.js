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
      if (line.indexOf('CREDITOR_') > 0) {
        const delimitorKey = Object.keys(delimiters).find((delimitorKey) => {
          return line.indexOf(delimitorKey) > -1;
        });
        console.log('found',delimitorKey)
        if (delimitorKey) {
          const delimitor = delimiters[delimitorKey];
          return line.replace(delimitorKey, usage.replace(/\//g, delimitor))
        }
        console.log('warning: line', line, 'does not porperly use CREDITOR_');
      }
      return line;
    }).join('\n');
}

module.exports = utils_renderTemplate;
