const _ = require("lodash");

const isObject = (item) => {
  return typeof item === "object" && !Array.isArray(item) && item !== null;
};

const isASet = (value) => {
  return isObject(value) && "sets" in value;
};
const valueFormatter = (token, dictionary) => {
  if (!dictionary.usesReference(token.original.value)) return token.value;
  return `var(--${token.original.value
    .substring(1, token.original.value.length - 1)
    .split(".")
    .join("-")})`;
};
const formatter = ({ dictionary, platform, file, options }) => {
  const resultAr = [];
  dictionary.allTokens.forEach((token) => {
    let name = token.path;
    if (isASet(options)) {
      const setsIndex = token.path.indexOf("sets");
      name = token.path.filter((element, index) => {
        return !(index == setsIndex || index == setsIndex + 1);
      });
    }
    resultAr.push(
      `  --${name.join("-")}: ${valueFormatter(token, dictionary)};`
    );
  });

  return `:root {
${resultAr.join(`
`)}
}
`;
};
formatter.nested = true;

module.exports = {
  name: "css/sets",
  formatter,
};
