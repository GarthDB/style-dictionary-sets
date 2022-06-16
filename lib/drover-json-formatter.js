const helpers = require("./helper-functions.js");

const initial = {
    system: "Spectrum",
    version: "0.0.0-development",
    KEYS: {
      DIMENSION_LAYOUT_TOKENS: "layoutTokens",
      DIMENSION_COMPONENT_LAYOUT_TOKENS: "componentLayoutTokens",
      COLOR_THEMES: "colorThemes",
      COLOR_TOKENS: "colorTokens",
      COLOR_ALIASES: "colorAliases",
      COLOR_SEMANTICS: "colorSemantics",
      DIMENSIONS: "dimensions",
    },
    colorThemes: {
      light: {},
      dark: {},
      darkest: {},
    },
    dimensions: {},
  };

const genType = (token) => {
  if (!token.path.includes("express")) {
    if (helpers.colorRegex.test(token.value)) {
      let stopPrefix = "";
      if (token.path.includes("light")) {
        return "light";
      } else if (token.path.includes("dark")) {
        return "dark";
      } else if (token.path.includes("darkest")) {
        return "darkest";
      } else {
        return "colorGlobal";
      }
    } else if (helpers.dimensionRegex.test(token.value)) {
      let scalePrefix = "";
      if (token.path.includes("desktop")) {
        return "desktop";
      } else if (token.path.includes("mobile")) {
        return "mobile";
      } else {
        return "dimensionGlobals";
      }
    }
  }
};

const getValue = (token, dictionary) => {
  const ref = token.original.value;
  if (helpers.isASet(token.value)) {
    const sets = {};
    for (const setName in token.value.sets) {
      sets[setName] = getValue(token.value.sets[setName], dictionary);
    }
    return { ref, sets };
  } else {
    return { ref, value: token.value };
  }
};

const formatter = ({ dictionary, platform, file, options }) => {
  const prefix = platform.prefix ? platform.prefix : false;
  const result = { ...initial };
  result.colorThemes = {
    light: {},
    dark: {},
    darkest: {},
  };
  result.dimensions = {};
  dictionary.allTokens.forEach((token) => {
    if (dictionary.usesReference(token)) {
      if (
        token.value.hasOwnProperty("sets") &&
        token.value.sets.hasOwnProperty("spectrum") &&
        token.value.sets.hasOwnProperty("express")
      ) {
        token.value = token.value.sets.spectrum;
      }
      if (helpers.isASet(token.value)) {
        const newValue = getValue(token, dictionary);
        if (
          newValue.sets.hasOwnProperty("light") &&
          newValue.sets.hasOwnProperty("dark") &&
          newValue.sets.hasOwnProperty("darkest")
        ) {
          result.colorThemes.light[
            helpers.generateNameArray(token, prefix).join("-")
          ] = newValue.sets.light.value;
          result.colorThemes.dark[
            helpers.generateNameArray(token, prefix).join("-")
          ] = newValue.sets.dark.value;
          result.colorThemes.darkest[
            helpers.generateNameArray(token, prefix).join("-")
          ] = newValue.sets.darkest.value;
        } else {
          // The only token here is android elevation
        }
      } else {
        if (genType(token) == "colorGlobal") {
          result.colorThemes.light[
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
          result.colorThemes.dark[
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
          result.colorThemes.darkest[
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
        }
      }
    } else {
      token.attributes.tokenType = genType(token);
      switch (token.attributes.tokenType) {
        case "dimensionGlobals":
        case "desktop":
          result.dimensions[
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
          break;
        case "light":
        case "dark":
        case "darkest":
          result.colorThemes[token.attributes.tokenType][
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
          break;
        case "colorGlobal":
          result.colorThemes.light[
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
          result.colorThemes.dark[
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
          result.colorThemes.darkest[
            helpers.generateNameArray(token, prefix).join("-")
          ] = token.value;
          break;
        default:
      }
    }
  });
  result.colorThemes.light = helpers.sortObject(
    result.colorThemes.light
  );
  result.colorThemes.dark = helpers.sortObject(
    result.colorThemes.dark
  );
  result.colorThemes.darkest = helpers.sortObject(
    result.colorThemes.darkest
  );
  result.dimensions = helpers.sortObject(result.dimensions, {
    description: "A scale stop of a given size",
    "scale-factor": "1",
  });
  return JSON.stringify(result, null, 2);
};

formatter.nested = true;

module.exports = {
  name: "drover/json/sets",
  formatter,
};
