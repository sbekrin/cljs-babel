const babel = require('babel-core');

function transform(input) {
  return babel.transform(input, {
    presets: require.resolve('babel-preset-cljs'),
  }).code;
}

module.exports = { transform };
