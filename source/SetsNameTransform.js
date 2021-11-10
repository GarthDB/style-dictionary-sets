const keyWord = "sets";

export default {
  name: "name/sets",
  type: "name",
  matcher: (prop) => {
    return prop.path.includes(keyWord);
  },
  transformer: (prop, options) => {
    const nameAr = prop.name.split("-");
    nameAr.splice(nameAr.indexOf(keyWord), 2);
    return nameAr.join("-");
  },
};
