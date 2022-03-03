const merge = require("deepmerge");

const isObject = (item) => {
  return typeof item === "object" && !Array.isArray(item) && item !== null;
};

const pathToObj = (pathAr, value) =>
  pathAr.reduceRight((value, key) => ({ [key]: value }), value);

const formatter = ({ dictionary, platform, file, options }) => {
  let resultObj = {};
  dictionary.allTokens.forEach((token) => {
    if (isObject(token.value) && "sets" in token.value) {
      const ref = token.original.value;
      const sets = {};
      for (const setName in token.value.sets) {
        sets[setName] = { value: token.value.sets[setName].value };
      }
      resultObj = merge(resultObj, pathToObj(token.path, { ref, sets }));
    } else {
      resultObj = merge(
        resultObj,
        pathToObj(token.path, { value: token.value })
      );
    }
  });
  return JSON.stringify(resultObj, null, 2);
};

module.exports = {
  name: "json/sets",
  formatter,
};
