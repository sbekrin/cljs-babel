const { transformFromAst } = require('babel-core');

function generatorProxy(data) {
    return transformFromAst(data.ast, data.sourceCode);
}

module.exports = generatorProxy;