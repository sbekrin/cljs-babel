const t = require('babel-types');
const { toFlat } = require('../../../utils');

function translateArithmeticList(node) {
    return (translate) => {
        const values = node.values.slice(1, node.values.length);
        const generateRegularTranslator = (node) => {
            const operator = node.values[0].value;
            const values = node.values.slice(1, node.values.length);

            if (values.length === 0) {
                return t.binaryExpression(1);
            }

            let expression = t.binaryExpression(
                operator,
                toFlat(translate(values[0])),
                toFlat(translate(values[1]))
            );

            if (values.length > 2) {
                values.slice(2, values.length).forEach((node) => {
                    expression = t.binaryExpression(
                        operator,
                        expression,
                        toFlat(translate(node))
                    );
                });
            }

            return t.parenthesizedExpression(expression);
        }

        switch (node.values[0].value) {
            case '+':
            case '-':
            case '*':
            case '/':
                return generateRegularTranslator(node);

            case 'quot':
            case 'rem':
            case 'mod':
            case 'inc':
            case 'dec':
            case 'max':
            case 'min':
                throw new Error('Not implemented');

            default:
                return null;
        }
    };
}

module.exports = translateArithmeticList;