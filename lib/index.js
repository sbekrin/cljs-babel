const duplexer = require('duplexer');
const createParser = require('./parser');
const createTranslator = require('./translator');
const createAssembler = require('./assembler');

function createCompiler() {
    const parser = createParser();
    const translator = createTranslator();
    const assembler = createAssembler();

    parser.pipe(translator).pipe(assembler);

    return duplexer(parser, assembler);
}

module.exports = createCompiler;