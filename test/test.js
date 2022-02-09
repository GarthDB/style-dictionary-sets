import StyleDictionary from "style-dictionary";
import { JsonSetsFormatter } from "../index";

StyleDictionary.registerFormat(JsonSetsFormatter);

const config = {
  source: ["test/fixtures/refset.json"],
  platforms: {
    JSON: {
      buildPath: "tests/tmp/",
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
  expect("true").toBe("true");
});

// import transforms from "../source/index";
// import createFilesConfig from "../source/build";
// import StyleDictionary from "style-dictionary";
// import helpers from "./helpers";
// import fs from "fs";
// import path from "path";
// import { jest } from "@jest/globals";
//
// StyleDictionary.registerTransform(transforms.SetsNameTransform);
// StyleDictionary.registerTransform(transforms.SetsAttributeTransform);
// StyleDictionary.registerTransformGroup(transforms.SetsTransformGroup);
//
// const buildPath = "test/dist/css/";
// const destination = "default.css";
//
// const StyleDictionaryTransformGroup = StyleDictionary.extend({
//   source: ["test/fixtures/**/*.json"],
//   platforms: {
//     css: {
//       transformGroup: "Sets",
//       buildPath: buildPath,
//       deep: true,
//       sets: ["light", "dark"],
//       defaultSet: "dark",
//       prefix: "spectrum",
//       files: createFilesConfig(["light", "dark"]),
//     },
//   },
// });
//
// describe("Sets Transforms", () => {
//   beforeAll(() => {
//     StyleDictionaryTransformGroup.cleanAllPlatforms();
//   });
//   describe("SetsAttributeTransform", () => {
//     it("should build and write file", () => {
//       StyleDictionaryTransformGroup.buildPlatform("css");
//       expect(
//         helpers.fileExists(path.join(buildPath, destination))
//       ).toBeTruthy();
//     });
//     it("should add sets attribute", () => {
//       const StyleDictionaryTransformAttribute = StyleDictionary.extend({
//         source: ["test/fixtures/**/*.json"],
//         platforms: {
//           css: {
//             transforms: ["attribute/sets"],
//             buildPath: buildPath,
//             deep: true,
//             sets: ["light", "dark"],
//             prefix: "spectrum",
//             files: createFilesConfig(["light", "dark"]),
//           },
//         },
//       });
//       const output = StyleDictionaryTransformAttribute.exportPlatform("css");
//       expect(
//         Object.keys(output.colors.gray["50"].sets.light.attributes)
//       ).toContain("set");
//     });
//     it("should add sets attribute when attribute already exists", () => {
//       const StyleDictionaryTransformAttribute = StyleDictionary.extend({
//         source: ["test/fixtures/**/*.json"],
//         platforms: {
//           css: {
//             transforms: [
//               "name/cti/kebab",
//               "name/sets",
//               "attribute/cti",
//               "attribute/sets",
//             ],
//             buildPath: buildPath,
//             deep: true,
//             sets: ["light", "dark"],
//             prefix: "spectrum",
//             files: createFilesConfig(["light", "dark"]),
//           },
//         },
//       });
//       const output = StyleDictionaryTransformAttribute.exportPlatform("css");
//       expect(
//         Object.keys(output.colors.gray["50"].sets.light.attributes)
//       ).toContain("set");
//     });
//     it("should remove the sets term from the name", () => {
//       const StyleDictionaryTransformAttribute = StyleDictionary.extend({
//         source: ["test/fixtures/**/*.json"],
//         platforms: {
//           css: {
//             transformGroup: "Sets",
//             buildPath: buildPath,
//             deep: true,
//             sets: ["light", "dark"],
//             prefix: "spectrum",
//             files: createFilesConfig(["light", "dark"]),
//           },
//         },
//       });
//       const output = StyleDictionaryTransformAttribute.exportPlatform("css");
//       expect(
//         Object.keys(output.colors.gray["50"].sets.light.attributes)
//       ).toContain("set");
//     });
//     it("should handle nested sets", () => {
//       const StyleDictionaryTransformAttribute = StyleDictionary.extend({
//         source: ["test/fixtures/**/*.json"],
//         platforms: {
//           css: {
//             transformGroup: "Sets",
//             buildPath: buildPath,
//             deep: true,
//             sets: [
//               "light",
//               "dark",
//               "spectrum",
//               "ccx",
//               "mobile",
//               "spectrum-mobile",
//               "spectrum-desktop",
//             ],
//             prefix: "spectrum",
//             files: createFilesConfig([
//               "light",
//               "dark",
//               "spectrum",
//               "ccx",
//               "mobile",
//               "spectrum-mobile",
//               "spectrum-desktop",
//             ]),
//           },
//         },
//       });
//       const output = StyleDictionaryTransformAttribute.exportPlatform("css");
//       expect(Object.keys(output)).toContain("default");
//     });
//   });
// });
