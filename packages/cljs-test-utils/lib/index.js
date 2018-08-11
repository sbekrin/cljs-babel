const babel = require('babel-core');

function transform(input) {
  return babel.transform(input, {
    presets: require.resolve('babel-preset-cljs'),
  }).code;
}

function evaluate(input) {
  return eval(transform(input));
}

module.exports = { transform, evaluate };
