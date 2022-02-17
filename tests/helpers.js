import fs from "fs-extra";

const outputDir = "tests/__output/";

export default {
  outputDir,
  clearOutput: () => {
    fs.emptyDirSync(outputDir);
  },
  fileToJSON: (path) => {
    return fs.readJsonSync(path);
  },
  fileExists: (filePath) => {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  },
  pathDoesNotExist: (path) => {
    try {
      return !fs.existsSync(path);
    } catch (err) {
      return false;
    }
  },
  dirDoesNotExist: (dirPath) => {
    return this.pathDoesNotExist(dirPath);
  },
  fileDoesNotExist: (filePath) => {
    return this.pathDoesNotExist(filePath);
  },
};
