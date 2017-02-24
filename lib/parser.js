const jison = require('jison');
const grammar = require('./grammar');
const scope = require('./scope');
const parser = new jison.Parser(grammar);
parser.yy = scope;

module.exports = parser;