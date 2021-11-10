import SetsAttributeTransform from "./SetsAttributeTransform";
import SetsValueTransform from "./SetsValueTransform";
import SetsNameTransform from "./SetsNameTransform";

export default {
  SetsAttributeTransform,
  SetsNameTransform,
  SetsValueTransform,
  SetsTransformGroup: {
    name: "Sets",
    transforms: [
      SetsAttributeTransform.name,
      SetsValueTransform.name,
      SetsNameTransform.name,
      "name/cti/kebab",
    ],
  },
};
