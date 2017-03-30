const t = require('babel-types');
const { toFlat } = require('@cljs/helpers');

function translateBranchList(node) {
    return (translate) => {
        const wrapWithBlockExpression = (node) => {
            return t.blockStatement([
                t.expressionStatement(toFlat(node))
            ]);
        };

        switch (node.values[0].value) {
            case 'if': {
                const condition = toFlat(translate(node.values[1]));
                const consequent = wrapWithBlockExpression(translate(node.values[2]));
                const alternate = (
                    3 in node.values ?
                    wrapWithBlockExpression(translate(node.values[3])) :
                    null
                );

                return t.ifStatement(condition, consequent, alternate);
            }

            case 'if-not':
            case 'when':
            case 'when-not':
            case 'when-let':
            case 'when-first':
            case 'if-let':
            case 'cond':
            case 'condp':
            case 'case':
            case 'when-some':
            case 'if-some':
                throw new Error('Not implemented');

            default:
                return null;
        }
    };
}

module.exports = translateBranchList;