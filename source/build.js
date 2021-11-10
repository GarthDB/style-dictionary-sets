const defaultTemplate = {
  destination: "index.css",
  options: {
    showFileHeader: false,
    outputReferences: true,
  },
  format: "css/variables",
};

function filterTemplate(token) {
  const isDefaultSet = token.attributes.defaultSet == this.set;
  if(!token.attributes.hasOwnProperty('set')) console.log({isDefaultSet, token})
  if (isDefaultSet && !token.attributes.hasOwnProperty('set')) {
    console.log('ding');
    return true;
  } else if(token.attributes.set == this.set) {
    return true;
  }
  return false;
}

export default function createFilesConfig(sets) {
  const files = sets.map((set) => {
    return {
      ...defaultTemplate,
      ...{
        destination: `${set}.css`,
        filter: filterTemplate.bind({ set }),
      },
    };
  });

  return files;
}
