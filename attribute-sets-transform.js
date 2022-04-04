module.exports = {
  type: "attribute",
  name: "attribute/sets",
  matcher: (token) => token.path.includes("sets"),
  transformer: (token) => {
    return {
      sets: token.path.filter(
        (part, index, array) => array[index - 1] == "sets"
      ),
    };
  },
};
