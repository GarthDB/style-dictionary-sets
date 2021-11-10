const filterTemplate = (token) => {
  const attributes = token.attributes || {};
  if (!this) {
    return !attributes.hasOwnProperty("set");
  }
  return attributes.hasOwnProperty("set") && attributes.set == this.set;
}

export default (
  sets,
  defaultTemplate = {
    destination: "index.css",
    options: {
      showFileHeader: false,
      outputReferences: true,
    },
    format: "css/variables",
  }
) => {
  const files = sets.map((set) => {
    return {
      ...defaultTemplate,
      ...{
        destination: `${set}.css`,
        filter: filterTemplate.bind({ set }),
      },
    };
  });
  files.push({
    ...defaultTemplate,
    ...{
      destination: "default.css",
      filter: filterTemplate,
    },
  });
  return files;
};
