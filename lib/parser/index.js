const jison = require('jison');
const through = require('through');
const grammar = require('./grammar');
const scope = require('./scope');

const jisonParser = new jison.Parser(grammar);
jisonParser.yy = scope;

function createParser() {
    let input = '';

    function write(chunk) {
        input += chunk;
    }

    function end() {
        this.queue(jisonParser.parse(input)).queue(null);
    }

    return through(write, end);
}

module.exports = createParser;