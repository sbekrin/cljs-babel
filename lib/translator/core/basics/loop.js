const t = require('babel-types');

function translateLoopList(node) {
    switch (node.values[0].value) {
        case 'map':
        case 'map-indexed':
        case 'reduce':
        case 'for':
        case 'doseq':
        case 'dotimes':
        case 'while':
        case 'mapv':
        case 'filterv':
        case 'reduce-kv':
            return new Error('Not implemented');

        default:
            return null;
    }
}

module.exports = translateLoopList;