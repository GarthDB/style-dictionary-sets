import StyleDictionary from "style-dictionary";
import { JsonSetsFormatter } from "../index";

import fs from "fs";

StyleDictionary.registerFormat(JsonSetsFormatter);

const config = {
  source: ["test/fixtures/refset.json"],
  platforms: {
    JSON: {
      buildPath: "test/tmp/",
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

test("ref to set should include all values", () => {
  const sd = StyleDictionary.extend(config);
  sd.buildAllPlatforms();
  const expected = fs.readFileSync("./test/expected/refset.json", {
    encoding: "utf8",
  });
  const result = fs.readFileSync("./test/tmp/refset.json", {
    encoding: "utf8",
  });
  expect(JSON.parse(result)).toMatchObject(JSON.parse(expected));
});
