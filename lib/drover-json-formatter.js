const jsonSetsFormatter = require("./json-sets-formatter");
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

const getFlatValue = (obj, setName) => {
  if (obj.hasOwnProperty("value")) {
    return obj.value;
  } else if (obj.hasOwnProperty("sets")) {
    if (obj.sets.hasOwnProperty(setName)) {
      return getFlatValue(obj.sets[setName], setName);
    } else if (obj.sets.hasOwnProperty("spectrum")) {
      return getFlatValue(obj.sets.spectrum, setName);
    }
  }
};

const formatter = ({ dictionary, platform, file, options }) => {
  const prefix = platform.prefix ? platform.prefix : false;
  const result = JSON.parse(JSON.stringify(initial));
  const jsonSets = JSON.parse(
    jsonSetsFormatter.formatter({ dictionary, platform, file, options })
  );
  Object.keys(jsonSets).forEach((tokenName, i) => {
    const newName = (prefix)? `${prefix}-${tokenName}` : tokenName;
    const tokenValue = jsonSets[tokenName];
    if (tokenValue.hasOwnProperty("value")) {
      if (helpers.colorRegex.test(tokenValue.value)) {
        result.colorThemes.light[newName] = tokenValue.value;
        result.colorThemes.dark[newName] = tokenValue.value;
        result.colorThemes.darkest[newName] = tokenValue.value;
      }
      if(helpers.dimensionRegex.test(tokenValue.value)) {
        result.dimensions[newName] = tokenValue.value;
      }
    } else {
      const lightValue = getFlatValue(tokenValue, "light");
      if (lightValue) {
        result.colorThemes.light[newName] = lightValue;
      }
      const darkValue = getFlatValue(tokenValue, "dark");
      if (darkValue) {
        result.colorThemes.dark[newName] = darkValue;
      }
      const darkestValue = getFlatValue(tokenValue, "darkest");
      if (darkestValue) {
        result.colorThemes.darkest[newName] = darkestValue;
      }
      const desktopValue = getFlatValue(tokenValue, "desktop");
      if (desktopValue) {
        result.dimensions[newName] = desktopValue;
      }
    }
  });
  result.colorThemes.light = helpers.sortObject(result.colorThemes.light);
  result.colorThemes.dark = helpers.sortObject(result.colorThemes.dark);
  result.colorThemes.darkest = helpers.sortObject(result.colorThemes.darkest);
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
