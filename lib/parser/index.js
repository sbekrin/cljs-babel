const CljsParser = require('./parser');
const parser = new CljsParser();

function parse(input) {
    return {
        sourceCode: input,
        cljsAst: parser.parse(input)
    };
}

module.exports = parse;