const keyWord = "sets";

export default {
  name: "value/sets",
  type: "value",
  matcher: (prop) => {
    return prop.attributes && prop.attributes[keyWord];
  },
  transformer: (prop, options) => {
    let value = prop.value;
    // for (const setKey in prop.sets) {
    //   if (options.sets.includes(setKey)) {
    //     value = prop.attributes.sets[setKey];
    //   }
    // }
    return prop.value;
  }
}
