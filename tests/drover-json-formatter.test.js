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
  helpers.clearOutput();
});

afterEach(() => {
  helpers.clearOutput();
});

test("drover format supports prefix", () => {
  const filename = "drover-prefix.json";
  const newConfig = generateConfig(filename);
  newConfig.platforms.drover.prefix = "aprefix";
  const sd2 = StyleDictionary.extend(newConfig);
  sd2.buildAllPlatforms();
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(result).toMatchSnapshot();
});

test("drover format meets basic requirements", () => {
  const filename = "drover.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(result).toMatchSnapshot();
});

test("drover multi level with repeating color themes", () => {
  const filename = "drover-nested-color-sets.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(result).toMatchSnapshot();
});
