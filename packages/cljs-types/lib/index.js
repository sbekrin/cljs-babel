const l = require('./types');

function collectArgs(values, value) {
  if (Array.isArray(value)) {
    values = values.concat(value);
  } else {
    values.push(value);
  }
  return values;
}

function mapLocation(location) {
  return [
    location.first_line,
    location.first_column,
    location.last_line,
    location.last_column,
  ];
}

function createProgram(leaf, location) {
  return new l.ProgramNode(leaf, location);
}

function createLeaf(left, right, location) {
  return new l.LeafNode(left, right, location);
}

function createComment(text, location) {
  return new l.CommentNode(text, location);
}

function createForm(values, location) {
  return new l.FormNode(values, location);
}

function createMeta(value, location) {
  return new l.MetaNode(value, location);
}

function createSymbol(value, meta, location) {
  return new l.SymbolNode(value, meta, location);
}

function createKeyword(name, location) {
  return new l.KeywordNode(name, location);
}

function createList(values, location) {
  return new l.ListNode(values, location);
}

function createVector(values, location) {
  return new l.VectorNode(values, location);
}

function createMap(values, location) {
  return new l.MapNode(values, location);
}

function createSet(values, location) {
  return new l.SetNode(values, location);
}

function createString(value, location) {
  return new l.StringNode(value, location);
}

function createCharacter(value, location) {
  return new l.CharacterNode(value, location);
}

function createBoolean(value, location) {
  return new l.BooleanNode(value, location);
}

function createNumber(value, location) {
  return new l.NumberNode(value, location);
}

function createNaN(location) {
  return new l.NaNNode(location);
}

function createInfinity(negative, location) {
  return new l.InfinityNode(negative, location);
}

function createNull(location) {
  return new l.NullNode(location);
}

function createRegExp(expression, location) {
  return new l.RegExpNode(expression, location);
}

module.exports = Object.assign({}, l, {
  collectArgs,
  mapLocation,
  createProgram,
  createLeaf,
  createComment,
  createForm,
  createMeta,
  createSymbol,
  createKeyword,
  createList,
  createVector,
  createMap,
  createSet,
  createString,
  createCharacter,
  createBoolean,
  createNumber,
  createNaN,
  createInfinity,
  createNull,
  createRegExp,
});
