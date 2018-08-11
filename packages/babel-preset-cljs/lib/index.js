const translator = require('@cljs/translator');
const parser = require('@cljs/parser');
const plugins = require('./plugins');

function syntax() {
  return {
    manipulateOptions(options) {
      options.parserOpts = {
        parser(code) {
          const ast = parser.parse(code);
          const output = translator.translate(ast);
          return output;
        },
      };
    },
  };
}

function preset() {
  return {
    plugins: [syntax].concat(plugins),
  };
}

module.exports = preset;
