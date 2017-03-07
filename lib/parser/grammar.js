const skip = (comment) => `/* skip ${comment} */`;
const atom = (type) => `return "${type}";`;
const grammar = {
    lex: {
        rules: [
            [ '[\\s,]+', skip('space') ],
            [ '#\\![^\\n]*', skip('shebang') ],
            [ '[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?', atom('number') ],
            [ '\"([^"]|\\\\\")*\"?', atom('string') ],
            [ '#\"([^"]|\\\\\")*\"?', atom('regexp') ],
            [ '\\[^\\s]*', atom('character') ],
            [ '\:[\\w=+\\-*&?!$%|<>\\./]*', atom('keyword') ],
            // TODO: namespaced keyword
            [ ';+[^\\n]*', atom('comment') ],
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
            [ 'leaf end_of_file', 'return yy.createProgram(@$, $1)' ]
        ],
        leaf: [
            'code',
            [ 'leaf code', '$$ = yy.createLeaf(@$, $1, $2)' ]
        ],
        code: [
            'list',
            [ 'comment', '$$ = yy.createComment(@$, $1)' ]
        ],
        value: [
            [ 'string', '$$ = yy.createString(@$, "" + $1)' ],
            [ 'character', '$$ = yy.createCharacter(@$, "" + $1)' ],
            [ 'boolean', '$$ = yy.createBoolean(@$, $1 === "true")' ],
            [ 'number', '$$ = yy.createNumber(@$, Number($1))' ],
            [ 'nan', '$$ = yy.createNaN(@$)' ],
            [ 'infinity', '$$ = yy.createInfinity(@$, $1[0] === "-")' ],
            [ 'nil', '$$ = yy.createNull(@$)' ],
            'id',
            'list',
            'vector',
            'map',
            'set'
        ],
        values: [
            [ 'value', '$$ = [ $1 ]' ],
            [ 'values value', '$$ = yy.collectArgs($1, $2)' ]
        ],
        id: [
            [ 'symbol', '$$ = yy.createSymbol(@$, $1)' ],
        ],
        list: [
            [ '( id )', '$$ = yy.createList(@$, [ $2 ])' ],
            [ '( )', '$$ = yy.createList(@$, [])' ],
            [ '( id values )', '$$ = yy.createList(@$, [ $2 ].concat($3))' ]
        ],
        vector: [
            [ '[ values ]', '$$ = yy.createVector(@$, $2)' ],
            [ '[ ]', '$$ = yy.createVector(@$, [])' ],
        ],
        map: [
            [ '{ values }', '$$ = yy.createMap(@$, $2)' ],
            [ '{ }', '$$ = yy.createMap(@$, [])' ]
        ],
        set: [
            [ '#{ values }', '$$ = yy.createSet(@$, $2)' ],
            [ '#{ }', '$$ = yy.createSet(@$, [])' ]
        ]
        // TODO: namespaced map
    }
};

module.exports = grammar;