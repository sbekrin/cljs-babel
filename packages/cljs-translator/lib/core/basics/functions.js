const t = require('babel-types');
const { toFlat } = require('@cljs/helpers');

function translateFunctionList(node) {
    return (translate) => {
        switch (node.values[0].value) {
            // Create
            case 'fn': {
                const args = node.values[1].values.map((arg) => translate(arg));
                const bodyNodes = node.values.slice(2, node.values.length);
                const body = bodyNodes.map((node) => {
                    const element = toFlat(translate(node));
                    return (
                        node.last ?
                        t.returnStatement(element) :
                        t.expressionStatement(element)
                    );
                });

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
    };
}

module.exports = translateFunctionList;