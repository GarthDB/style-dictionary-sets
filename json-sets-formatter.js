import merge from "deepmerge";

const isObject = (item) => {
  return typeof item === "object" && !Array.isArray(item) && item !== null;
};

const pathToObj = (pathAr, value) =>
  pathAr.reduceRight((value, key) => ({ [key]: value }), value);

const formatter = ({ dictionary, platform, file, options }) => {
  let resultObj = {};
  dictionary.allTokens.forEach((token) => {
    if (isObject(token.value)) {
      const ref = token.original.value;
      const value = {
        sets: {
          mobile: token.value.sets.mobile.value,
          desktop: token.value.sets.desktop.value,
        },
      };
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
