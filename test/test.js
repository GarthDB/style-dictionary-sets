import transforms from "../source/index";
import StyleDictionary from "style-dictionary";
import helpers from "./helpers";
import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";

StyleDictionary.registerTransform(transforms.SetsValueTransform);
StyleDictionary.registerTransform(transforms.SetsNameTransform);
StyleDictionary.registerTransform(transforms.SetsAttributeTransform);
StyleDictionary.registerTransformGroup(transforms.SetsTransformGroup);

const buildPath = "test/dist/css/";
const destination = "default.css";

const StyleDictionaryTransformGroup = StyleDictionary.extend({
  source: ["test/fixtures/**/*.json"],
  platforms: {
    css: {
      transformGroup: "Sets",
      buildPath: buildPath,
      deep: true,
      sets: ["dark"],
      prefix: "spectrum",
      files: [
        {
          destination: destination,
          options: {
            showFileHeader: false,
            outputReferences: true,
          },
          format: "css/variables",
        },
      ],
    },
  },
});

describe("Sets Transforms", () => {
  beforeAll(() => {
    StyleDictionaryTransformGroup.cleanAllPlatforms();
  });
  describe("SetsAttributeTransform", () => {
    it("should build and write file", () => {
      StyleDictionaryTransformGroup.buildPlatform("css");
      expect(
        helpers.fileExists(path.join(buildPath, destination))
      ).toBeTruthy();
    });
    it("should add sets attribute", () => {
      const StyleDictionaryTransformAttribute = StyleDictionary.extend({
        source: ["test/fixtures/**/*.json"],
        platforms: {
          css: {
            transforms: ["name/cti/kebab", "name/sets", "attribute/sets"],
            buildPath: buildPath,
            deep: true,
            sets: ["dark"],
            prefix: "spectrum",
            files: [
              {
                destination: destination,
                options: {
                  showFileHeader: false,
                  outputReferences: true,
                },
                format: "css/variables",
              },
            ],
          },
        },
      });
      const output = StyleDictionaryTransformAttribute.exportPlatform("css");
      expect(
        Object.keys(output.colors.gray["50"].sets.light.attributes)
      ).toContain("sets");
    });
    it("should add sets attribute when attribute already exists", () => {
      const StyleDictionaryTransformAttribute = StyleDictionary.extend({
        source: ["test/fixtures/**/*.json"],
        platforms: {
          css: {
            transforms: [
              "name/cti/kebab",
              "name/sets",
              "attribute/cti",
              "attribute/sets",
            ],
            buildPath: buildPath,
            deep: true,
            sets: ["dark"],
            prefix: "spectrum",
            files: [
              {
                destination: destination,
                options: {
                  showFileHeader: false,
                  outputReferences: true,
                },
                format: "css/variables",
              },
            ],
          },
        },
      });
      const output = StyleDictionaryTransformAttribute.exportPlatform("css");
      expect(
        Object.keys(output.colors.gray["50"].sets.light.attributes)
      ).toContain("sets");
    });
  });
});
