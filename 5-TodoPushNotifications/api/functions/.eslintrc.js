/* eslint-disable quote-props */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: ["error", "double"],
    indent: [0],
    "object-curly-spacing": [0],
    "linebreak-style": [0],
  },
};
