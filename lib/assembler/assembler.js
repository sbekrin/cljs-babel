const { transformFromAst } = require('babel-core');

function assemble(data) {
    return transformFromAst(data.babelAst, data.sourceCode);
}

module.exports = assemble;