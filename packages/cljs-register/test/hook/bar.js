require('cljs-register');

const { square } = require('./foo.cljs');

module.exports = () => {
    return square(10);
};