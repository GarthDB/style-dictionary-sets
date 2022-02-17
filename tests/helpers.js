import fs from "fs-extra";

const outputDir = "tests/__output/";

export default {
  outputDir,
  clearOutput: () => {
    fs.emptyDirSync(outputDir);
  },
  fileToJSON: (path) => {
    return fs.readJsonSync(path);
  }
};
