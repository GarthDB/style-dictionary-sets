const _ = require("lodash");

const isObject = (item) => {
  return typeof item === "object" && !Array.isArray(item) && item !== null;
};

const isASet = (value) => {
  return isObject(value) && "sets" in value;
};
const formatter = ({ dictionary, platform, file, options }) => {
  const resultAr = [];
  dictionary.allTokens.forEach((token) => {
    let name = [];
    if (isASet(options)) {
      const setsIndex = token.path.indexOf("sets");
      name = token.path.filter((element, index) => {
        return !(index == setsIndex || index == setsIndex + 1);
      });
    }
    resultAr.push(`  --${name.join("-")}: ${token.value};`);
  });

  return `:root {
${resultAr.join(`
`)}
}
`;
};
// formatter.nested = true;

module.exports = {
  name: "css/sets",
  formatter,
};
