const StyleDictionary = require("style-dictionary");
const JsonSetsFormatter = require("../index").JsonSetsFormatter;
const NameKebabTransfom = require("../index").NameKebabTransfom;
const AttributeSetsTransform = require("../index").AttributeSetsTransform;
const helpers = require("./helpers");

const fs = require("fs");
const path = require("path");

StyleDictionary.registerTransform(NameKebabTransfom);
StyleDictionary.registerTransform(AttributeSetsTransform);
StyleDictionary.registerFormat(JsonSetsFormatter);

const generateConfig = (filename) => {
  return {
    source: [`tests/fixtures/${filename}`],
    platforms: {
      JSON: {
        buildPath: helpers.outputDir,
        transforms: [AttributeSetsTransform.name, NameKebabTransfom.name],
        files: [
          {
            destination: filename,
            format: "json/sets",
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

test("basic data with sets keyword in path should provide basic values", () => {
  const filename = "basic.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  const output = sd.exportPlatform('JSON');
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  expect(output).toMatchObject(expected);
});

test("basic data with nests sets keywords in path should provide multiple values to sets attribute", () => {
  const filename = "nest-sets-no-refs.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  const output = sd.exportPlatform('JSON');
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  expect(output).toMatchObject(expected);
});

test("a ref pointing to a set should include all values", () => {
  const filename = "set-in-ref.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

test("a ref that points to additional refs should resolve", () => {
  const filename = "multi-ref.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

test("should handle multi nested reference values", () => {
  const filename = "multi-depth.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

test("should handle multi nested values", () => {
  const filename = "multi-nested.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});

test("should keep included uuid", () => {
  const filename = "uuid.json";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
  const result = helpers.fileToJSON(path.join(helpers.outputDir, filename));
  expect(expected).toMatchObject(result);
});
