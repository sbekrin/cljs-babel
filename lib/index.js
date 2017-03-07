const duplexer = require('duplexer');
const through = require('through');
const parser = require('./parser');
const translator = require('./translator');
const assembler = require('./assembler');

function createCompiler() {
    const parse = parser();
    const translate = translator();
    const assemble = assembler();

    parse.pipe(translate).pipe(assemble);

    return duplexer(parse, assemble);
}

module.exports = createCompiler;