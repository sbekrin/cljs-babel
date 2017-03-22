const t = require('babel-types');
const { toFlat } = require('cljs-helpers');

function translateComparisonList(node) {
    return (translate) => {
        const generateLogicalExpression = (operator, left, right) => {
            return t.logicalExpression(operator, toFlat(left), toFlat(right));
        };

        const reduceArrayToLogicalExpression = (operator, nodes) => {
            let result = generateLogicalExpression(operator, nodes[0], nodes[1]);

            nodes.slice(2, nodes.length).forEach((node) => {
                result = generateLogicalExpression(operator, result, node);
            });

            return result;
        };

        const translateValues = (node, start = 1) => {
            return node.values
                .slice(start, node.values.length)
                .map((node) =>
                    toFlat(translate(node))
                );
        };

        switch (node.values[0].value) {
            case '=':
                const reference = toFlat(translate(node.values[1]));
                const values = translateValues(node, 2);

                if (values.length == 1) {
                    return t.binaryExpression('==', reference, toFlat(values));
                }

                const checks = translateValues(node, 2).map((expression) => (
                    t.parenthesizedExpression(
                        t.binaryExpression('==', reference, expression)
                    )
                ));

                return reduceArrayToLogicalExpression('&&', checks);

            case 'and':
                return reduceArrayToLogicalExpression('&&', translateValues(node));

            case 'or':
                return reduceArrayToLogicalExpression('||', translateValues(node));

            case 'not':
            case 'not=':
            case 'identical?':
            case 'compare':
            case '==':
            case '<':
            case '>':
            case '<=':
            case '>=':
                throw new Error('Not implemented');

            default:
                return null;
        }
    };
}

module.exports = translateComparisonList;