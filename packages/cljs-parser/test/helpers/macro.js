const parse = require('../../lib');

function parserMacro(assert, input, expected) {
    assert.is(parse(input).cljsAst, expected);
};

module.exports = parserMacro;