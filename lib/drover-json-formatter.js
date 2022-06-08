const helpers = require("./helper-functions.js");

const initial = {
  drover: {
    system: "Spectrum",
    version: "11.7.0",
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
  },
};

const genType = (token) => {
  if (!token.path.includes("ccx")) {
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
    // console.log({
    //   name: token.name,
    //   path: token.path,
    //   value: token.value,
    //   dimension: helpers.dimensionRegex.test(token.value),
    //   desktop: token.path.includes("desktop"),
    //   mobile: token.path.includes("mobile"),
    //   color: helpers.colorRegex.test(token.value),
    //   file: token.filePath,
    // });
  }
};

const getValue = (token, dictionary) => {
  if (dictionary.usesReference(token.original.value)) {
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
  } else {
    return { value: token.value };
  }
};

const formatter = ({ dictionary, platform, file, options }) => {
  const result = { ...initial };
  dictionary.allTokens.forEach((token) => {
    if (dictionary.usesReference(token)) {
      if (helpers.isASet(token.value)) {
        const newValue = getValue(token, dictionary);
        if (
          newValue.sets.hasOwnProperty("spectrum") &&
          newValue.sets.hasOwnProperty("express")
        ) {
          newValue.sets = newValue.sets.spectrum.sets;
        }
        if (
          newValue.sets.hasOwnProperty("light") &&
          newValue.sets.hasOwnProperty("dark") &&
          newValue.sets.hasOwnProperty("darkest")
        ) {
          result.drover.colorThemes.light[
            helpers.generateNameArray(token).join("-")
          ] = newValue.sets.light.value;
          result.drover.colorThemes.dark[
            helpers.generateNameArray(token).join("-")
          ] = newValue.sets.dark.value;
          result.drover.colorThemes.darkest[
            helpers.generateNameArray(token).join("-")
          ] = newValue.sets.darkest.value;
        } else {
          // The only token here is android elevation
        }
      } else {
        if (genType(token) == "colorGlobal") {
          result.drover.colorThemes.light[
            helpers.generateNameArray(token).join("-")
          ] = token.value;
          result.drover.colorThemes.dark[
            helpers.generateNameArray(token).join("-")
          ] = token.value;
          result.drover.colorThemes.darkest[
            helpers.generateNameArray(token).join("-")
          ] = token.value;
        }
      }
    } else {
      token.attributes.tokenType = genType(token);
      switch (token.attributes.tokenType) {
        case "dimensionGlobals":
        case "desktop":
          result.drover.dimensions[helpers.generateNameArray(token).join("-")] =
            token.value;
          break;
        case "light":
        case "dark":
        case "darkest":
          result.drover.colorThemes[token.attributes.tokenType][
            helpers.generateNameArray(token).join("-")
          ] = token.value;
          break;
        default:
      }
    }
  });
  result.drover.colorThemes.light = helpers.sortObject(
    result.drover.colorThemes.light
  );
  result.drover.colorThemes.dark = helpers.sortObject(
    result.drover.colorThemes.dark
  );
  result.drover.colorThemes.darkest = helpers.sortObject(
    result.drover.colorThemes.darkest
  );
  result.drover.dimensions = helpers.sortObject(result.drover.dimensions, {
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
