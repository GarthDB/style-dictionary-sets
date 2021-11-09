const keyWord = "sets";

export default {
  name: "name/sets",
  type: "name",
  matcher: (prop) => {
    return prop.attributes && prop.attributes[keyWord];
  },
  transformer: (prop, options) => {
    let name = prop.name;
    console.log(options.sets);
    console.log(prop);
    // console.log(prop.attributes)
    // console.log(options.sets);
    // // for (const setKey in prop.sets) {
    // //   if (options.sets.includes(setKey)) {
    // //     value = prop.attributes.sets[setKey];
    // //   }
    // // }
    return false;
  }
}
