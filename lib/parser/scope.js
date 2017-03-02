class Node{
    /**
     * @param {string} type
     * @param {Node|Leaf} [left]
     * @param {Node|Leaf} [right]
     */
    constructor(type, left = null, right = null) {
        this.type = type;
        this.left = left;
        this.right = right;
    }
}

class Leaf extends Node {
    /**
     * @param {Token} token
     */
    constructor(token) {
        super('leaf', token, null);
    }
}

class Token {
    /**
     * @param {string} type
     * @param {number|string} value
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

/**
 * @param {string} type
 * @param {Node|Leaf} [left]
 * @param {Node|Leaf} [right]
 */
function createNode(type, left, right) {
    return new Node(type, left, right);
}

/**
 * @param {string} type
 * @param {number|string} value
 */
function createLeaf(type, value) {
    return new Leaf(createToken(type, value));
}

/**
 * @type {strong} type
 * @type {number|string} value
 */
function createToken(type, value) {
    return new Token(type, value);
}

module.exports.createNode = createNode;
module.exports.createLeaf = createLeaf;
module.exports.createToken = createToken;