function toFlat(node) {
  return Array.isArray(node) ? node[0] : node;
}

function isEven(length) {
  return length % 2 === 0;
}

function resolveSymbol(value = '') {
  return (
    value
      // Clean dots
      .replace(/^\.\-/, '')
      .replace(/^\./, '')
      .replace(/\.$/, '')
      // Replace non-compliant chars
      .replace(/\-/g, '_')
      .replace(/\+/g, '_PLUS_')
      .replace(/\>/g, '_LT_')
      .replace(/\</g, '_GT_')
      .replace(/\//g, '_SLASH_')
      .replace(/\|/g, '_BAR_')
      .replace(/\?/g, '_QMARK_')
      .replace(/!/g, '_BANG_')
      .replace(/%/g, '_PERCENT_')
      .replace(/&/g, '_AMPERSAND_')
  );
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
