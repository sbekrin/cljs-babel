const parse = require('./parse');

function parserProxy(input) {
    return {
        sourceCode: input,
        ast: parse(input)
    };
}

module.exports = parserProxy;