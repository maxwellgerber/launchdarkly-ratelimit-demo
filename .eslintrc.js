module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    mocha: true
  },
  plugins: [
    "mocha"
  ],
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    "no-await-in-loop": "off",
    "no-plusplus": "off",
  },
};
