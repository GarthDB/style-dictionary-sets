const StyleDictionary = require("style-dictionary");
const DroverJsonFormatter = require("../index").DroverJsonFormatter;
const NameKebabTransfom = require("../index").NameKebabTransfom;
const AttributeSetsTransform = require("../index").AttributeSetsTransform;
const helpers = require("./helpers");

const fs = require("fs");
const path = require("path");

StyleDictionary.registerTransform(NameKebabTransfom);
StyleDictionary.registerTransform(AttributeSetsTransform);
StyleDictionary.registerFormat(DroverJsonFormatter);

const generateConfig = (filename) => {
  return {
    source: [`tests/fixtures/${filename}`],
    platforms: {
      drover: {
        buildPath: helpers.outputDir,
        transforms: [AttributeSetsTransform.name, NameKebabTransfom.name],
        files: [
          {
            destination: filename,
            format: DroverJsonFormatter.name,
            options: {
              showFileHeader: false,
              outputReferences: true,
            },
          },
        ],
      },
    },
  };
};

beforeEach(() => {
  // helpers.clearOutput();
});

afterEach(() => {
  // helpers.clearOutput();
});
test("placeholder", () => {
  expect(true).toBe(true);
});
