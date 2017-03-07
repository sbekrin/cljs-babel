class Node {
    constructor({ first_line, first_column, last_line, last_column }) {
        this.startLine = first_line;
        this.startColumn = first_column;
        this.endLine = last_line;
        this.endColumn = last_column;
    }
}

class ProgramNode extends Node {
    constructor(location, body) {
        super(location);
        this.body = body;
    }
}

class LeafNode extends Node {
    constructor(location, left, right) {
        super(location);
        this.left = left;
        this.right = right;
    }
}

class CommentNode extends Node {
    constructor(location, text) {
        super(location);
        this.text = text;
    }
}

class SymbolNode extends Node {
    constructor(location, value) {
        super(location);
        this.value = value;
    }
}

class ListNode extends Node {
    constructor(location, values) {
        super(location);
        this.values = values;
    }
}

class VectorNode extends Node {
    constructor(location, values) {
        super(location);
        this.values = values;
    }
}

class MapNode extends Node {
    constructor(location, values) {
        super(location);
        this.values = values;
    }
}

class SetNode extends Node {
    constructor(location, values) {
        super(location);
        this.value = values;
    }
}

class StringNode extends Node {
    constructor(location, value) {
        super(location);
        this.value = value;
    }
}

class CharacterNode extends Node {
    constructor(location, value) {
        super(location);
        this.value = value;
    }
}

class BooleanNode extends Node {
    constructor(location, value) {
        super(location);
        this.value = value;
    }
}

class NumberNode extends Node {
    constructor(location, value) {
        super(location);
        this.value = value;
    }
}

class NaNNode extends Node {
}

class InfinityNode extends Node {
    constructor(location, negative = false) {
        super(location);
        this.negative = negative;
    }
}

class NullNode extends Node {
}

module.exports = {
    ProgramNode,
    LeafNode,
    CommentNode,
    SymbolNode,
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
};