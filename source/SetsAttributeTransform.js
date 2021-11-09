const keyWord = "sets";

export default {
  name: "attribute/sets",
  type: "attribute",
  matcher: (prop) => {
    return prop.path.includes(keyWord);
  },
  transformer: (prop, options) => {
    const attributes = prop.attributes || {};
    attributes.sets = prop.path.slice(prop.path.indexOf(keyWord) + 1);
    return attributes;
  },
};
