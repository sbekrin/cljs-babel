const through = require('through');
const CljsParser = require('./parser');
const parser = new CljsParser();

function createParser() {
    let input = '';

    function write(chunk) {
        input += chunk;
    }

    function end() {
        const data = {
            code: input,
            ast: parser.parse(input)
        };

        this.queue(data).queue(null);
    }

    return through(write, end, { objectMode: true });
}

module.exports = createParser;