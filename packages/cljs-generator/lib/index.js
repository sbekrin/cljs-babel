const { transformFromAst } = require('babel-core');

function generate(data) {
    return transformFromAst(data.babelAst, data.sourceCode);
}

module.exports = generate;