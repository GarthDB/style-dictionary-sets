const merge = require("deepmerge");

const isObject = (item) => {
  return typeof item === "object" && !Array.isArray(item) && item !== null;
};

const pathToObj = (pathAr, value) =>
  pathAr.reduceRight((value, key) => ({ [key]: value }), value);

const isASet = (value) => {
  return isObject(value) && "sets" in value;
};

const getValue = (token, dictionary) => {
  if (dictionary.usesReference(token)) {
    const ref = token.original.value;
    if (isASet(token.value)) {
      const sets = {};
      for (const setName in token.value.sets) {
        sets[setName] = getValue(token.value.sets[setName], dictionary);
      }
      return { ref, sets };
    } else {
      return { ref, value: token.value };
    }
  } else {
    return { value: token.value }
  }
};

const formatter = ({ dictionary, platform, file, options }) => {
  let resultObj = {};
  dictionary.allTokens.forEach((token) => {
    const value = getValue(token, dictionary);
    resultObj = merge(resultObj, pathToObj(token.path, value));
  });
  return JSON.stringify(resultObj, null, 2);
};
formatter.nested = true;

module.exports = {
  name: "json/sets",
  formatter,
};
