import merge from "deepmerge";

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
      const value = { sets: {} };
      for (const setName in token.value.sets) {
        value.sets[setName] = token.value.sets[setName].value;
      }
      resultObj = merge(resultObj, pathToObj(token.path, { ref, value }));
    } else {
      resultObj = merge(
        resultObj,
        pathToObj(token.path, { value: token.value })
      );
    }
  });
  return JSON.stringify(resultObj, null, 2);
};

export default {
  name: "json/sets",
  formatter,
};
