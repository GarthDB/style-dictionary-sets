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
  isObject,
  isASet,
  generateNameArray,
  sortObject,
};
