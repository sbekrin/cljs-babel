class Node {
    constructor(location = []) {
        this.last = false;
        this.location = {
            startLine: location[0] || 0,
            startColumn: location[1] || 0,
            endLine: location[2] || 0,
            endColumn: location[3] || 0
        }
    }
}

class ProgramNode extends Node {
    constructor(program, location) {
        super(location);
        this.program = program;
    }
}

class LeafNode extends Node {
    constructor(left = null, right = null, location) {
        super(location);
        this.left = left;
        this.right = right;
    }
}

class CommentNode extends Node {
    constructor(text, location) {
        super(location);
        this.text = text;
    }
}

class SymbolNode extends Node {
    constructor(value, location) {
        super(location);
        this.value = value;
    }
}

class KeywordNode extends Node {
    constructor(name, location) {
        super(location);
        this.name = name;
    }
}

class ListNode extends Node {
    constructor(values, location) {
        super(location);
        this.values = values;
    }
}

class VectorNode extends Node {
    constructor(values, location) {
        super(location);
        this.values = values;
    }
}

class MapNode extends Node {
    constructor(values, location) {
        super(location);
        this.values = values;
    }
}

class SetNode extends Node {
    constructor(values, location) {
        super(location);
        this.value = values;
    }
}

class StringNode extends Node {
    constructor(value, location) {
        super(location);
        this.value = value;
    }
}

class CharacterNode extends Node {
    constructor(value, location) {
        super(location);
        this.value = value;
    }
}

class BooleanNode extends Node {
    constructor(value, location) {
        super(location);
        this.value = value;
    }
}

class NumberNode extends Node {
    constructor(value, location) {
        super(location);
        this.value = value;
    }
}

class NaNNode extends Node {
}

class InfinityNode extends Node {
    constructor(negative = false, location) {
        super(location);
        this.negative = negative;
    }
}

class NullNode extends Node {
}

class RegExpNode extends Node {
    constructor(expression, location) {
        super(location);
        this.expression = expression;
    }
}

module.exports = {
    ProgramNode,
    LeafNode,
    CommentNode,
    SymbolNode,
    KeywordNode,
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
    NullNode,
    RegExpNode
};