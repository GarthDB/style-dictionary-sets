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

const isExpress = (token) => token.name.indexOf('express') > -1;

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
      } else if (token.path.includes("wireframe")) {
        return "wireframe";
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

  dictionary.allTokens.forEach((token) => {
    if (dictionary.usesReference(token)) {
      if (
        token.value.hasOwnProperty("sets") &&
        token.value.sets.hasOwnProperty("spectrum") &&
        token.value.sets.hasOwnProperty("express")
      ) {
        // color alias with color semantic were getting tripped up here
        // set the value here to just the value in spectrum
        // instead of the whole token that comes in with the spectrum set
        token.value = token.value.sets.spectrum.value;
        // we might want to instead define a whole new token and save the 
        // full ref, but drover doesn't care so this should be fine
      }

      // process sets here, but not a set that came from express
      // the nested reference for accent-color gets stopped here
      // could probably fix later in getValue but this works for now 
      if (helpers.isASet(token.value) && !isExpress(token)) {
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

        // it wasn't a set or it's an express set  
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
      // token didn't have a reference  
    } else {
      token.attributes.tokenType = genType(token);
      switch (token.attributes.tokenType) {
        case "wireframe":
          break;
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
