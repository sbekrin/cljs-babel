const t = require('babel-types');

function translateTestFunction(node) {
    switch (node.values[0].value) {
        // Basics
        case 'true?':
        case 'false?':
        case 'instance?':
        case 'nil?':
        case 'some?':

        // Numbers
        case 'zero?':
        case 'pos?':
        case 'neg?':
        case 'even?':
        case 'odd?':
        case 'number?':
        case 'integer?':
        
        // Functions
        case 'fn?':
        case 'ifn?':

        // Strings
        case 'string?':
        case 'blank?':

        // Interop
        case 'array?':
        case 'fn?':
        case 'number?':
        case 'object?':
        case 'string?':

        // Collections content test
        case 'distinct?':
        case 'empty?':
        case 'every?':
        case 'not-every?':
        case 'somenot-any?':

        // Collections type test
        case 'coll?':
        case 'list?':
        case 'vector?':
        case 'set?':
        case 'map?':
        case 'seq?':

        // Sets test
        case 'subset?':
        case 'superset?':
            return new Error('Not implemented');

        default:
            return null;
    }
}

module.exports = translateTestFunction;