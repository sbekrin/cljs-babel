const skip = (comment) => `/* skip ${comment} */`;
const atom = (type) => `return "${type}";`;
const run = (method, ...args) => (
    `$$ = yy.${method}(${[ ...args, 'yy.mapLocation(@$)' ].join(', ')});`
);
const grammar = {
    lex: {
        rules: [
            [ '[\\s,]+', skip('space') ],
            [ '#\\![^\\n]*', skip('shebang') ],
            [ ';+[^\\n]*', skip('comment') ],
            [ '[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?', atom('number') ],
            [ '#\"([^"]|\\\\\")*\"?', atom('regexp') ],
            [ '\"([^"]|\\\\\")*\"?', atom('string') ],
            [ '\\[^\\s]*', atom('character') ],
            [ '\:[\\w=+\\-*&?!$%|<>\\./]*', atom('keyword') ],
            // TODO: namespaced keyword
            [ 'true|false', atom('boolean') ],
            [ 'nil', atom('nil') ],
            [ 'NaN', atom('nan') ],
            [ '[-+]?Infinity', atom('infinity') ],
            [ '[A-Za-z_=+\\-*&?!$%|<>\\./][\\w=+\\-*&?!$%|<>\\./]*', atom('symbol') ],
            [ '\\(', atom('(') ],
            [ '\\)', atom(')') ],
            [ '\\[', atom('[') ],
            [ '\\]', atom(']') ],
            [ '\\{', atom('{') ],
            [ '\\}', atom('}') ],
            [ `'`, atom(`'`) ],
            [ '`', atom('`') ],
            [ '@', atom('@') ],
            [ '\\^', atom('^') ],
            [ `#'`, atom(`#'`) ],
            [ '#_', atom('#_') ],
            [ '#', atom('#') ],
            [ '$', atom('end_of_file') ],
            [ '\.', atom('invalid') ],
        ]
    },
    bnf: {
        program: [
            [ 'leaf end_of_file', 'return yy.createProgram($1, yy.mapLocation(@$))' ]
        ],
        leaf: [
            'code',
            [ 'leaf code', run('createLeaf', '$1', '$2') ]
        ],
        code: [
            'list',
            [ 'comment', run('createComment', '$1.replace(/^[;| |\t]+/, "")') ]
        ],
        value: [
            [ 'keyword', run('createKeyword', '$1.replace(/^:/g, "")') ],
            [ 'string', run('createString', '"" + $1.replace(/^"|"$/g, "")') ],
            [ 'character', run('createCharacter', '"" + $1') ],
            [ 'boolean', run('createBoolean', '$1 === "true"') ],
            [ 'number', run('createNumber', 'Number($1)') ],
            [ 'nan', run('createNaN') ],
            [ 'infinity', run('createInfinity', '$1[0] === "-"') ],
            [ 'nil', run('createNull') ],
            [ 'regexp', run('createRegExp', '$2') ],
            'id',
            'list',
            'vector',
            'set',
            'map'
        ],
        values: [
            [ 'value', '$$ = [ $1 ]' ],
            [ 'values value', '$$ = yy.collectArgs($1, $2)' ]
        ],
        id: [
            [ 'symbol', run('createSymbol', '$1') ],
        ],
        list: [
            [ '( id )', run('createList', '[ $2 ]') ],
            [ '( )', run('createList', '[]') ],
            [ '( id values )', run('createList', '[ $2 ].concat($3)') ]
        ],
        vector: [
            [ '[ values ]', run('createVector', '$2') ],
            [ '[ ]', run('createVector', '[]') ],
        ],
        map: [
            [ '{ values }', run('createMap', '$2') ],
            [ '{ }', run('createMap', '[]') ]
        ],
        set: [
            [ '#{ values }', run('createSet', '$2') ],
            [ '#{ }', run('createSet', '[]') ]
        ]
        // TODO: namespaced map
    }
};

module.exports = grammar;