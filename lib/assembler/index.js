const stream = require('stream');
const through = require('through');
const { transformFromAst } = require('babel-core');

function createAssembler() {
    function write(data) {
        const result = transformFromAst(data.ast, data.code);
        this.queue(result.code);
    }

    return through(write, null);
}

module.exports = createAssembler;