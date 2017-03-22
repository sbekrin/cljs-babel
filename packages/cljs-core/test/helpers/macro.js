const compiler = require('../../lib');

function compilerMacro(assert, input, expected) {
    assert.is(compiler.compile(input).code, expected);
};

module.exports = compilerMacro;