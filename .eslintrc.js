/* eslint-disable no-undef */
const plugin = require("./index")
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: false,
  },
  plugins: [
    plugin
  ],
  extends: [
    'eslint:recommended',
  ]
}