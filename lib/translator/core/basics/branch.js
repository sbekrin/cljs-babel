const t = require('babel-types');

function translateBranchList(node) {
    switch (node.values[0].value) {
        case 'if':
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
}

module.exports = translateBranchList;