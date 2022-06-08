const helpers = require("../lib/helper-functions.js");

// isASet,
// sortObject,

test("isObject tests if something is an object", () => {
  expect(helpers.isObject({})).toBe(true);
});

test("isObject should return false with Array", () => {
  expect(helpers.isObject([])).toBe(false);
});

test("isObject should return false with null", () => {
  expect(helpers.isObject(null)).toBe(false);
});

test("", () => {
  expect(helpers.isASet({ sets: "ding" })).toBe(true);
});

test("generateNameArray should return array of name parts", () => {
  expect(
    helpers.generateNameArray({ path: ["part1", "part2", "part3"] }).join("-")
  ).toBe("part1-part2-part3");
});

test("generateNameArray should accept a prefix", () => {
  expect(
    helpers
      .generateNameArray({ path: ["part1", "part2", "part3"] }, "aprefix")
      .join("-")
  ).toBe("aprefix-part1-part2-part3");
});

test("generateNameArray should accept a prefix", () => {
  expect(
    helpers
      .generateNameArray(
        { path: ["part1", "part2", "part3", "sets", "mobile", "part4"] },
        "aprefix"
      )
      .join("-")
  ).toBe("aprefix-part1-part2-part3-part4");
});

test("sortObject should sort object by key values", () => {
  const fixture = { b: 1, z: 2, a: 3 };
  const expected = { a: 3, b: 1, z: 2 };
  expect(helpers.sortObject(fixture)).toMatchObject(expected);
});

test("colorRegex should match rgb values", () => {
  expect(helpers.colorRegex.test("rgb(0,0,0)")).toBe(true);
});

test("colorRegex should match rgba values", () => {
  expect(helpers.colorRegex.test("rgba(0, 0, 0, 1)")).toBe(true);
});

test("dimensionRegex should match dimension values", () => {
  expect(helpers.dimensionRegex.test("12px")).toBe(true);
});

test("dimensionRegex should fail invalid dimension values", () => {
  expect(helpers.dimensionRegex.test("ding")).toBe(false);
});
