const repl = require('repl');
const compiler = require('cljs-core');

function cljsEval(input, context, filename, callback) {
    callback(null, eval(compiler.compile(input).code));
}

repl.start({
    prompt: 'cljs > ',
    eval: cljsEval
});