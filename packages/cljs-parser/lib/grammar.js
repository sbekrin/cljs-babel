const skip = comment => `/* skip ${comment} */`;
const atom = type => `return "${type}";`;
const run = (method, ...args) =>
  `$$ = yy.${method}(${[...args, 'yy.mapLocation(@$)'].join(', ')});`;
const grammar = {
  lex: {
    rules: [
      ['[\\s,]+', skip('space')],
      ['#\\![^\\n]*', skip('shebang')],
      [';+[^\\n]*', skip('comment')],
      ['[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?', atom('number')],
      ['#"([^"]|\\\\")*"?', atom('regexp')],
      ['"([^"]|\\\\")*"?', atom('string')],
      ['\\[^\\s]*', atom('character')],
      [':[\\w=+\\-*&?!$%|<>\\./]*', atom('keyword_atom')],
      // TODO: namespaced keyword
      ['true|false', atom('boolean')],
      ['nil', atom('nil')],
      ['NaN', atom('nan')],
      ['[-+]?Infinity', atom('infinity')],
      [
        '[A-Za-z_=+\\-*&?!$%|<>\\./][\\w=+\\-*&?!$%|<>\\./]*',
        atom('symbol_atom'),
      ],
      ['\\(', atom('(')],
      ['\\)', atom(')')],
      ['\\[', atom('[')],
      ['\\]', atom(']')],
      ['\\{', atom('{')],
      ['\\}', atom('}')],
      [`'`, atom(`'`)],
      ['`', atom('`')],
      ['@', atom('@')],
      ['\\^', atom('^')],
      [`#'`, atom(`#'`)],
      ['#_', atom('#_')],
      ['#', atom('#')],
      ['$', atom('end_of_file')],
      ['.', atom('invalid')],
    ],
  },
  bnf: {
    program: [
      ['leaf end_of_file', 'return yy.createProgram($1, yy.mapLocation(@$))'],
    ],
    leaf: ['code', ['leaf code', run('createLeaf', '$1', '$2')]],
    code: [
      'list',
      'vector',
      'map',
      'set',
      'symbol',
      ['comment', run('createComment', '$1.replace(/^[;| |\t]+/, "")')],
    ],
    symbol: [
      ['symbol_atom', run('createSymbol', '$1', 'null')],
      ['metas symbol_atom', run('createSymbol', '$2', '$1')],
    ],
    keyword: [['keyword_atom', run('createKeyword', '$1')]],
    value: [
      ['string', run('createString', '"" + $1.replace(/^"|"$/g, "")')],
      ['character', run('createCharacter', '"" + $1')],
      ['boolean', run('createBoolean', '$1 === "true"')],
      ['number', run('createNumber', 'Number($1)')],
      ['nan', run('createNaN')],
      ['infinity', run('createInfinity', '$1[0] === "-"')],
      ['nil', run('createNull')],
      ['regexp', run('createRegExp', '$2')],
      'list',
      'keyword',
      'symbol',
      'vector',
      'set',
      'map',
    ],
    values: [
      ['value', '$$ = [ $1 ]'],
      ['values value', '$$ = yy.collectArgs($1, $2)'],
    ],
    meta: [
      ['^ symbol', run('createMeta', '$2')],
      ['^ keyword', run('createMeta', '$2')],
      ['^ map', run('createMeta', '$2')],
    ],
    metas: [
      ['meta', '$$ = [ $1 ]'],
      ['metas meta', '$$ = yy.collectArgs($1, $2)'],
    ],
    list: [
      ['metas ( values )', run('createList', '$3', '$2')],
      ['metas ( )', run('createList', '[]', '$2')],
      ['( values )', run('createList', '$2')],
      ['( )', run('createList', '[]')],
    ],
    vector: [
      ['metas [ values ]', run('createVector', '$3', '$2')],
      ['metas [ ]', run('createVector', '[]', '$2')],
      ['[ values ]', run('createVector', '$2')],
      ['[ ]', run('createVector', '[]')],
    ],
    set: [
      ['metas # { values }', run('createSet', '$4', '$3')],
      ['metas # { }', run('createSet', '[]', '$3')],
      ['# { values }', run('createSet', '$3')],
      ['# { }', run('createSet', '[]')],
    ],
    map: [
      ['metas { values }', run('createMap', '$3', '$2')],
      ['metas { }', run('createMap', '[]', '$2')],
      ['{ values }', run('createMap', '$2')],
      ['{ }', run('createMap', '[]')],
    ],
    // TODO: namespaced map
  },
};

module.exports = grammar;
