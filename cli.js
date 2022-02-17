#!/usr/bin/env node

const argv = require('yargs').argv;
const creditor = _tryRequire('@pclabs/creditor') || _tryRequire('./');

const instance = creditor();
return instance.prompt(argv)
  .then((answers) => {
    return instance.perform(answers);
  });

function _tryRequire(path) {
  try {
    return require(path);
  } catch (e) {
    return undefined;
  }
}
