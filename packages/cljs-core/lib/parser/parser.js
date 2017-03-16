const jison = require('jison');
const grammar = require('./grammar');
const scope = require('./scope');

class CljsParser extends jison.Parser {
    constructor() {
        super(grammar);
        this.yy = scope;
    }
}

module.exports = CljsParser;