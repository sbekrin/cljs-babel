const fs = require('fs');
const createParser = require('../lib');

const parser = createParser();
const inputStream = fs.createReadStream('__test/basic/in.cljs');
const outputStream = fs.createWriteStream('__test/basic/out.js');

inputStream.pipe(parser).pipe(outputStream);