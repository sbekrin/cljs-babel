const jison = require('jison');
const scope = require('@cljs/types');
const grammar = require('./grammar');

class CljsParser extends jison.Parser {
    constructor() {
        super(grammar);
        this.yy = scope;
    }
}

module.exports = CljsParser;