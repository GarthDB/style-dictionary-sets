import SetsAttributeTransform from "./SetsAttributeTransform";
import SetsNameTransform from "./SetsNameTransform";

export default {
  SetsAttributeTransform,
  SetsNameTransform,
  SetsTransformGroup: {
    name: "Sets",
    transforms: [
      "name/cti/kebab",
      SetsAttributeTransform.name,
      SetsNameTransform.name,
    ],
  },
};
