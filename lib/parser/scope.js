const {
    ProgramNode,
    LeafNode,
    CommentNode,
    SymbolNode,
    ValueNode,
    ListNode,
    VectorNode,
    MapNode,
    SetNode,
    StringNode,
    CharacterNode,
    BooleanNode,
    NumberNode,
    NaNNode,
    InfinityNode,
    NullNode
} = require('../language');

function collectArgs(values, value) {
    if (Array.isArray(value)) {
        values = values.concat(value);
    } else {
        values.push(value);
    }

    return values;
}

function createProgram(location, leaf) {
    return new ProgramNode(location, leaf);
}

function createLeaf(location, left, right) {
    return new LeafNode(location, left, right);
}

function createComment(location, text) {
    return new CommentNode(location, text);
}

function createSymbol(location, value) {
    return new SymbolNode(location, value);
}

function createValue(location, value) {
    return new ValueNode(location, value);
}

function createList(location, values) {
    return new ListNode(location, values);
}

function createVector(location, values) {
    return new VectorNode(location, values);
}

function createMap(location, values) {
    return new MapNode(location, values);
}

function createSet(location, values) {
    return new SetNode(location, values);
}

function createString(location, value) {
    return new StringNode(location, value);
}

function createCharacter(location, value) {
    return new CharacterNode(location, value);
}

function createBoolean(location, value) {
    return new BooleanNode(location, value);
}

function createNumber(location, value) {
    return new NumberNode(location, value);
}

function createNaN(location) {
    return new NaNNode(location);
}

function createInfinity(location, negative) {
    return new InfinityNode(location, negative);
}

function createNull(location) {
    return new NullNode(location);
}

module.exports = {
    collectArgs,
    createProgram,
    createLeaf,
    createComment,
    createSymbol,
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
    createNull
};