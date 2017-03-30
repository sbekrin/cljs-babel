const sourceMapSupport = require('source-map-support');
const { stripIndents } = require('common-tags');
const { compileFileSync } = require('cljs-compiler');

sourceMapSupport.install({
    handleUncaughtExceptions: false,
    environment: 'node',
    retrieveSourceMap(source) {
        const map = maps && maps[source];
        if (map) {
            return {
                url: null,
                map: map,
            };
        } else {
            return null;
        }
    }
});

const maps = {};
const defaultOptions = {
    extensions: [ '.clj', '.cljs', '.cljc' ]
};
const globalOptions = defaultOptions;

function compile(filename) {
    const output = compileFileSync(filename);

    maps[filename] = output.map;

    return output.code;
}

function registerExtension(extension) {
    require.extensions[extension] = (module, filename) => {
        module._compile(compile(filename), filename);
    };
}

function hookExtensions(extensions) {
    extensions.forEach((extension) => {
        registerExtension(extension);
    });
}

hookExtensions(globalOptions.extensions);

function register(options) {
    if (typeof options !== 'object') {
        throw new TypeError(stripIndents`
            Expected options to be object,
            got ${typeof options} instead.
        `);
    }

    if (extensions in options) {
        if (!Array.isArray(options.extensions)) {
            throw new Error(stripIndents`
                Expected options.extensions to be array,
                got ${typeof options.extensions} instead.
            `);
        }

        globalOptions.extensions = options.extensions;

        hookExtensions(globalOptions.extensions);
    }
};

module.exports = register;