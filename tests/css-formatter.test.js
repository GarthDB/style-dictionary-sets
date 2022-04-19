const StyleDictionary = require("style-dictionary");
const CSSSetsFormatter = require("../index").CSSSetsFormatter;
const NameKebabTransfom = require("../index").NameKebabTransfom;
const AttributeSetsTransform = require("../index").AttributeSetsTransform;
const helpers = require("./helpers");

const fs = require("fs");
const path = require("path");

StyleDictionary.registerTransform(NameKebabTransfom);
StyleDictionary.registerTransform(AttributeSetsTransform);
StyleDictionary.registerFormat(CSSSetsFormatter);

const generateConfig = (filename) => {
  return {
    source: [`tests/fixtures/${filename}.json`],
    platforms: {
      CSS: {
        buildPath: helpers.outputDir,
        transforms: [AttributeSetsTransform.name, NameKebabTransfom.name],
        files: [
          {
            destination: `${filename}.css`,
            format: CSSSetsFormatter.name,
            filter: (token) => {
              return (
                typeof token.attributes === "object" &&
                !Array.isArray(token.attributes) &&
                token.attributes !== null &&
                "sets" in token.attributes &&
                token.attributes.sets.includes("desktop")
              );
            },
            options: {
              showFileHeader: false,
              outputReferences: true,
              sets: ["desktop"],
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

test("basic data with sets keyword in path should provide basic css", () => {
  const filename = "basic";
  const sd = StyleDictionary.extend(generateConfig(filename));
  sd.buildAllPlatforms();
  const result = fs.readFileSync(
    path.join(helpers.outputDir, `${filename}.css`),
    {
      encoding: "utf8",
    }
  );
  const expected = fs.readFileSync(`./tests/expected/${filename}.css`, {
    encoding: "utf8",
  });
  expect(result).toEqual(expected);
});
