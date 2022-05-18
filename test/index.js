const Mocha = require("mocha");
var mocha = new Mocha();

const path = require("path");

const testFolder = "./tests/";
const toRequire = "fs";
const fs = require(toRequire);

const src = require("./");

const files = findFiles(path.join(__dirname, '/../src'), [], /test\.js$/).filter(
  (item) => item !== path.join(__dirname,'/test.js')
);

files.forEach((item) => {
  mocha.addFile(item);
});

mocha.run((err) => {
  if (err) {
    process.exit(1);
  }
});

function findFiles(base = "", all = [], condition) {
  const files = fs.readdirSync(base) || [];
  files.forEach((file) => {
    if (file.indexOf(".") === 0) return;
    if (file.indexOf(".") < 0)
      return findFiles(path.join(base,`/${file}`), all, condition);
    all.push(path.join(base,`/${file}`));
  });

  return all.filter((item) => condition.test(item));
}
