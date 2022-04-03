const fs = require("fs");
const readline = require("readline");

async function fs_processLineByLine(filePath, processor = () => {}) {
  const file = readline.createInterface({
    input: fs.createReadStream(filePath),
    terminal: false,
  });

  let lnNumber = 0;
  file.on("line", (line) => {
    processor(line, lnNumber);
    lnNumber++;
  });

  return new Promise((resolve) => file.on("close", resolve));
}

module.exports = fs_processLineByLine;
