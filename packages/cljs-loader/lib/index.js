function cljsLoader(source, map) {
    this.callback(null, source, map);
}

module.exports = cljsLoader;