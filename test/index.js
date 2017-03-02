const fs = require('fs');
const createParser = require('../lib');

const parser = createParser();
const inputStream = fs.createReadStream('test/basic/in.cljs');
const outputStream = fs.createWriteStream('test/basic/out.js');

inputStream.pipe(parser).pipe(outputStream);