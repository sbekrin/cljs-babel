import parse from '../../lib';

function parserMacro(assert, input, expected) {
    assert.deepEqual(parse(input).ast, expected);
}

export default parserMacro;