const t = require('babel-types');
const { toFlat } = require('../../../utils');

function translateDefineFunction(node, translate) {
    switch (node.values[0].value) {
        case 'def': {
            const name = translate(node.values[1]);
            const value = translate(node.values[2]);

            return t.variableDeclaration('var', [
                t.variableDeclarator(
                    toFlat(name),
                    toFlat(value)
                )]
            );
        }

        case 'defn':
        case 'defn-':
        case 'let':
        case 'letfn':
        case 'declare':
        case 'ns':
            throw new Error('Not implemented');

        default:
            return null;
    }
}

module.exports = translateDefineFunction;