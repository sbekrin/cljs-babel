class Node {
    constructor(location = []) {
        this.last = false;
        this.location = {
            startLine: location[0] || 0,
            startColumn: location[1] || 0,
            endLine: location[2] || 0,
            endColumn: location[3] || 0
        };
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

class FormNode extends Node {
    constructor(values, location) {
        super(location);
        this.values = values;
    }
}

class MetaNode extends Node {
    constructor(value, location) {
        super(location);
        this.value = value;
    }
}

class SymbolNode extends Node {
    constructor(value, meta, location) {
        if (location === undefined) {
            location = meta;
            meta = null;
        }

        super(location);
        this.meta = meta;
        this.value = value;
    }
}

class KeywordNode extends Node {
    constructor(name, location) {
        super(location);
        this.name = name;
    }
}

class CollectionNode extends Node {
    constructor(values, meta, location) {
        if (location === undefined) {
            location = meta;
            meta = null;
        }

        super(location);
        this.meta = meta;
        this.values = values;
    }
}

class ListNode extends CollectionNode {
}

class VectorNode extends CollectionNode {
}

class MapNode extends CollectionNode {
}

class SetNode extends CollectionNode {
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
    FormNode,
    MetaNode,
    SymbolNode,
    KeywordNode,
    CollectionNode,
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