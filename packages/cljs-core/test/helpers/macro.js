const compiler = require('cljs-compiler');

function compilerMacro(assert, input, expected) {
    assert.is(compiler.compile(input).code, expected);
};

module.exports = compilerMacro;