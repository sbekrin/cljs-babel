function toFlat(node) {
  return Array.isArray(node) ? node[0] : node;
}

function isEven(length) {
  return length % 2 === 0;
}

function resolveSymbol(value = '') {
  return value
    .replace(/^\.\-/, '')
    .replace(/^\./, '')
    .replace(/\.$/, '');
}

function resolveKeyword(value = '') {
  return value.replace(/\:/, '');
}

module.exports = {
  toFlat,
  isEven,
  resolveSymbol,
  resolveKeyword,
};
