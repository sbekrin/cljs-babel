const t = require('babel-types');

function translateArithmeticOperation(node) {
    const values = node.values.slice(1, node.values.length);

    switch (node.values[0].value) {
        case '+':
        case '-':
        case '*':
        case '/':
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
}

module.exports = translateArithmeticOperation;