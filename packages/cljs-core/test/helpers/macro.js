import compiler from '../../lib';

function compilerMacro(assert, input, expected) {
    assert.is(compiler.compile(input).code, expected);
}

export default compilerMacro;