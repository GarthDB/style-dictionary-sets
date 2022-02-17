import StyleDictionary from "style-dictionary";
import { JsonSetsFormatter } from "../index";
import helpers from './helpers';

import fs from "fs";
import path from "path";

StyleDictionary.registerFormat(JsonSetsFormatter);

const config = {
  source: ["tests/fixtures/refset.json"],
  platforms: {
    JSON: {
      buildPath: helpers.outputDir,
      transforms: ["attribute/cti", "name/cti/kebab"],
      files: [
        {
          destination: "refset.json",
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

beforeEach(() => {
  helpers.clearOutput();
});

afterEach(() => {
   helpers.clearOutput();
 });

test("ref to set should include all values", () => {
  const sd = StyleDictionary.extend(config);
  sd.buildAllPlatforms();
  const expected = helpers.fileToJSON("./tests/expected/refset.json");
  const result = helpers.fileToJSON(path.join(helpers.outputDir, "refset.json"));
  expect(result).toMatchObject(expected);
});
