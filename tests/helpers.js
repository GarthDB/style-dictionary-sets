const fs = require("fs-extra");

const outputDir = "tests/__output/";

module.exports = {
  outputDir,
  clearOutput: () => {
    fs.emptyDirSync(outputDir);
  },
  fileToJSON: (path) => {
    return fs.readJsonSync(path);
  }
};
