function toFlat(node) {
    return Array.isArray(node) ? node[0] : node;
}

module.exports = {
    toFlat
};