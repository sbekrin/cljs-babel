const t = require('babel-types');
const { toFlat } = require('../../../utils');

function translateFunctionList(node, translate) {
    switch (node.values[0].value) {
        // Create
        case 'fn': {
            const args = node.values[1].values
                .map((arg) => translate(arg));
            const bodyNodes = node.values.slice(2, node.values.length);
            const lastNodeIndex = bodyNodes.length - 1;
            const body = bodyNodes
                .map((node) => toFlat(translate(node)))
                .map((expression, index) => (
                    lastNodeIndex === index ?
                    t.returnStatement(expression) :
                    t.expressionStatement(expression)
                ));

            return t.functionExpression(null, args, t.blockStatement(body));
        }

        case 'defn':
        case 'defn-':
        case 'identity':
        case 'constantly':
        case 'comp':
        case 'complement':
        case 'partial':
        case 'juxt':
        case 'memoize':
        case 'fnil':
        case 'every-pred':
        case 'some-fn':

        // Call
        case 'apply':
        case '->':
        case '->>':
        case 'as->':
        case 'cond->':
        case 'cond->>':
        case 'some->':
        case 'some->>':
            throw new Error('Not implemented');

        default:
            return null;
    }
}

module.exports = translateFunctionList;