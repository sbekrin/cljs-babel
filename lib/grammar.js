const skip = (comment) => `/* skip ${comment} */`;
const atom = (type) => `return "${type}";`;
const block = (head, body) => [ head, `$$ = ${body};` ];
const node = (head, ...rest) => block(head, `yy.createNode(${rest.join(', ')})`);
const leaf = (head, ...rest) => block(head, `yy.createLeaf(${rest.join(', ')})`);
const grammar = {
    lex: {
        rules: [
            [ '[\\s,]+', skip('whitespace') ],
            [ ';[^\\n]*', skip('line comment') ],
            [ 'true|false', atom('BOOLEAN') ],
            [ '[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?', atom('NUMBER') ],
            [ '\"([^"]|\\\\\")*\"?', atom('STRING') ],
            [ '\:[\\w=+\\-*&?!$%|<>\\./]*', atom('KEYWORD') ],
            [ '[A-Za-z_=+\\-*&?!$%|<>\\./][\\w=+\\-*&?!$%|<>\\./]*', atom('SYMBOL') ],
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
            [ `#`, atom(`#`) ],
            [ '$', atom('EOF') ],
            [ '\.', atom('INVALID') ],
        ]
    },
    bnf: {
        lists: [
            [ 'list_list EOF', 'return $1;' ]
        ],
        list_list: [
            block('list', '$1'),
            node('list_list list', '"list_list"', '$1', '$2')
        ],
        list: [
            node('( )', '"list"'),
            node('( s_exp_list )', '"list"', '$2')
        ],
        vector: [
            node('[ ]', '"vector"'),
            node('[ s_exp_list ]', '"vector"', '$2')
        ],
        map: [
            node(`{ }`, '"map"'),
            node(`{ s_exp_list }`, '"map"', '$2')
        ],
        s_exp_list: [
            node('s_exp', '"s_exp_list"', '$1'),
            node('s_exp s_exp_list', '"s_exp_list"', '$1', '$2')
        ],
        s_exp: [
            block('atom', '$1'),
            node('macro atom', '"macro"', '$1', '$2'),
            block('list', '$1'),
            node('macro list', '"macro"', '$1', '$2'),
            block('vector', '$1'),
            node('macro vector', '"macro"', '$1', '$2'),
            block('map', '$1'),
            node('macro map', '"macro"', '$1', '$2')
        ],
        macro: [
            leaf("'", '"quote"', 'yytext'),
            leaf('`', '"syntax_quote"', 'yytext'),
            leaf('@', '"deref"', 'yytext'),
            leaf('^', '"metadata"', 'yytext'),
            leaf("#'", '"dispatch"', 'yytext'),
            leaf('#_', '"dispatch"', 'yytext'),
            leaf('#', '"dispatch"', 'yytext')
        ],
        atom: [
            leaf('KEYWORD', '"keyword"', 'yytext'),
            leaf('SYMBOL', '"symbol"', 'yytext'),
            leaf('NUMBER', '"number"', 'Number(yytext)'),
            leaf('STRING', '"string"', 'yytext.replace(/^"|"$/g, "")'),
            leaf('BOOLEAN', '"boolean"', 'yytext === "true"'),
        ]
    }
};

module.exports = grammar;