const fs = require('fs');
const crypto = require('crypto');
const parse = require('./parser');
const translate = require('./translator');
const assemble = require('./assembler');
const cache = new Map();

function md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Compiles string input
 * @param {string} input 
 * @returns {Object}
 */
function compile(input) {
    if (typeof input !== 'string') {
        throw new Error(`Expected input to be a string, got ${typeof input} instead`);
    }

    const hash = md5(input);

    if (!cache.has(hash)) {
        cache.set(hash, assemble(translate(parse(input))));
    }

    return cache.get(hash);   
}

/**
 * Compile file async, will return promise if callback is omitted
 * @param {string} path
 * @param {Function<error, data>?} callback
 * @returns {Promise|void}
 */
function compileFile(path, callback) {
    const hasCallback = typeof callback === 'function';
    const readAndCompile = (resolve, reject) => {
        fs.readFile(path, { encoding: 'utf8' }, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(compile(data));
            }
        });
    }

    return (
        hasCallback ?
        readAndCompile(
            (data) => callback(null, data),
            (error) => callback(error, null)
        ) :
        new Promise(readAndCompile)
    );
}

/**
 * Compiles file sync
 * @param {string} path
 * @returns {string}
 */
function compileFileSync(path) {
    return compile(fs.readFileSync(path, { encoding: 'utf8' }));
}

module.exports = {
    compile,
    compileFile,
    compileFileSync
};