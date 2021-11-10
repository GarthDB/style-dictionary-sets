const keyWord = "sets";

export default {
  name: "attribute/sets",
  type: "attribute",
  matcher: (prop) => {
    return prop.path.includes(keyWord);
  },
  transformer: (prop, options) => {
    const attributes = prop.attributes || {};
    attributes.set = prop.path[(prop.path.indexOf(keyWord) + 1)];
    if(options.defaultSet) attributes.defaultSet = options.defaultSet;
    return attributes;
  },
};
