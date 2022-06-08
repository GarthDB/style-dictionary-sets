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
      DNA: {
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
})
// test("basic dna json data output", () => {
//   const filename = "basic.json";
//   const sd = StyleDictionary.extend(generateConfig(filename));
//   const output = sd.exportPlatform('DNA');
//   console.log(JSON.stringify(output,'',2));
//   const expected = helpers.fileToJSON(`./tests/expected/${filename}`);
//   expect(output).toMatchObject(expected);
// });
