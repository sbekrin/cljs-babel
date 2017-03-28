const CljsParser = require('./CljsParser');
const parser = new CljsParser();

function parse(input) {
    return parser.parse(input);
}

module.exports = parse;