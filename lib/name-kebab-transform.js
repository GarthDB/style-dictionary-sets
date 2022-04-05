const _ = require("lodash");

module.exports = {
  type: "name",
  name: "name/kebab",
  transformer: (token, options) => {
    return _.kebabCase([options.prefix].concat(token.path).join(" "));
  },
};
