
const Mocha = require('mocha');
var mocha = new Mocha();

const testFolder = './tests/';
const toRequire = 'fs'
const fs = require(toRequire);

const src = require('./');

const files = findFiles(`${__dirname}/../src`, [], /test\.js$/)
  .filter(item => item !== `${__dirname}/test.js`)

files.forEach((item) => {
  mocha.addFile(item)
});
mocha.run();

function findFiles(base = '', all = [], condition) {

  const files = fs.readdirSync(base) || [];
  files.forEach((file) => {
    if (file.indexOf(".") === 0) return;
    if (file.indexOf(".") < 0) return findFiles(`${base}/${file}`, all, condition)
    all.push(`${base}/${file}`)
  })

  return all.filter(item => condition.test(item));
}
