module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb", "p5js"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: [2, "single"],
    "no-console": 0,
  },
};
