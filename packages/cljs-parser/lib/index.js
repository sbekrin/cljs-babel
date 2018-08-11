const CljsParser = require('./parser');

const parser = new CljsParser();

function parse(input) {
  return parser.parse(input);
}

module.exports = { parse };
