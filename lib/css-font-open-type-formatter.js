module.exports = {
  type: "value",
  name: "font/openType",
  matcher: (token) => token.name.includes("font-weight"),
  transformer: (token) => {
    return {
      "light": "300",
      "regular": "400",
      "medium": "500",
      "semibold": "600",
      "semi-bold": "600",
      "bold": "700",
      "extrabold": "800",
      "extra-bold": "800",
      "black": "900"
    }[token.value] || token.value;
  },
};
