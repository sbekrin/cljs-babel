function toFlat(node) {
  return Array.isArray(node) ? node[0] : node;
}

function resolveSymbol(value = '') {
  return value
    .replace(/^\.\-/, '')
    .replace(/^\./, '')
    .replace(/\.$/, '');
}

module.exports = {
  toFlat,
  resolveSymbol,
};
