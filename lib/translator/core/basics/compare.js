const t = require('babel-types');

function translateCompareList(node) {
    switch (node.values[0].value) {
        case '=':
        case 'not=':
        case 'and':
        case 'or':
        case 'not':
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
}

module.exports = translateCompareList;