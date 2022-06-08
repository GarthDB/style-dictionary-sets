const dimensionRegex = /(?:[0-9]+px)|(?:[0-9]+\.[0-9]+)/;
const colorRegex =
  /rgba?\(([0-9]+), ?([0-9]+), ?([0-9]+)(?:, ?([0-1]|0\.[0-9]+))?\)/;

const isObject = (item) =>
  typeof item === "object" && !Array.isArray(item) && item !== null;

const isASet = (value) => isObject(value) && "sets" in value;

const generateNameArray = (token, prefix) => {
  let name = prefix ? [prefix] : [];
  const cleanTokenPath = [];
  for (let i = 0; i < token.path.length; i++) {
    if (token.path[i] === "sets") {
      i++;
    } else {
      cleanTokenPath.push(token.path[i]);
    }
  }
  name = name.concat(cleanTokenPath);
  return name;
};

const sortObject = (obj, initialObj = {}) =>
  Object.keys(obj)
    .sort()
    .reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, initialObj);

module.exports = {
  dimensionRegex,
  colorRegex,
  isObject,
  isASet,
  generateNameArray,
  sortObject,
};
