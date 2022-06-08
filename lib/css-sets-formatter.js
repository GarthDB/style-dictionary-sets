const helpers = require("./helper-functions.js");

const valueFormatter = (token, platform, dictionary) => {
  if (!dictionary.usesReference(token.original.value)) return token.value;
  const resultAr = token.original.value
    .substring(1, token.original.value.length - 1)
    .split(".");
  if (platform.prefix) {
    resultAr.splice(0, 0, platform.prefix);
  }
  return `var(--${resultAr.join("-")})`;
};
const formatter = ({ dictionary, platform, file, options }) => {
  const resultAr = [];
  dictionary.allTokens.forEach((token) => {
    const name = helpers.generateNameArray(token, platform.prefix);
    resultAr.push(
      `  --${name.join("-")}: ${valueFormatter(token, platform, dictionary)};`
    );
  });

  const selector = options.selector ?? ":root";

  return `${selector} {
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
