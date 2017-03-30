const t = require('babel-types');
const { toFlat } = require('@cljs/helpers');

function translateStringList(node) {
    return (translate) => {
        switch (node.values[0].value) {
            // Create
            case 'str': {
                const values = node.values
                    .slice(1, node.values.length)
                    .map((value) => toFlat(translate(value)));

                return t.callExpression(
                    t.memberExpression(
                        t.arrayExpression(values),
                        t.identifier('join')
                    ),
                    [ t.stringLiteral('') ]
                );
            }
            case 'name':

            // Use
            case 'count':
            case 'get':
            case 'subs':
            case 'join':
            case 'escape':
            case 'split':
            case 'split-lines':
            case 'replace':
            case 'replace-first':
            case 'reverse':
                throw new Error('Not implemented');

            default:
                return null;
        }
    };
}

module.exports = translateStringList;