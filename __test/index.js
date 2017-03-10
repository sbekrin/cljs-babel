const compiler = require('../lib');
const input = `
    (fn [x] (* x x))
`;
const output = compiler.compile(input);
console.log(output.code);