class Construct {}

class Func {
    constructor(name, args, body) {
        this.name = name;
        this.args = args;
        this.body = body;

        if (body.length) {
            body[body.length - 1].last = true;
        }
    }
}

class Lambda {
    constructor(args, body) {
        this.args = args;
        this.body = body;

        if (body.length) {
            body[body.length - 1].last = true;
        }
    }
}

class Variable {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class Invoke {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
}

class New {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
}

class Accessor {
    constructor(object, property) {
        this.object = object;
        this.property = property;
    }
}

class Keyword {
    constructor(name) {
        this.name = name;
    }
}

class Symbol {
    constructor(name) {
        this.name = name;
    }
}

class Str {
    constructor(value) {
        this.value = value;
    }
}

class Num {
    constructor(value) {
        this.value = value;
    }
}

class Bool {
    constructor(value) {
        this.value = value;
    }
}

class Namespace {
    constructor(name) {
        this.name = name;
    }
}

class Assign {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class Conditional extends Construct {
    constructor(condition, consequent, alternative) {
        super();
        this.condition = condition;
        this.consequent = consequent;
        this.alternative = alternative;
    }
}

class Comparison {
    constructor(type, left, right) {
        this.type = type;
        this.left = left;
        this.right = right;
    }
}

class While extends Construct {
    constructor(condition, body) {
        super();
        this.condition = condition;
        this.body = body;
    }
}

class WhileTrue extends Construct {
    constructor(body) {
        super();
        this.body = body;
    }
}

class Continue {}

class Scope {
    constructor(body) {
        this.body = body;
    }
}

class IndexedSymbol {
    constructor(index) {
        this.index = index;
    }
}

class Math {
    constructor(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

class Array {
    constructor(values) {
        this.values = values;
    }
}

module.exports = {
    Construct,
    Function: Func,
    Lambda,
    Variable,
    Invoke,
    New,
    Accessor,
    Keyword,
    Symbol,
    String: Str,
    Boolean: Bool,
    Number: Num,
    Namespace,
    Assign,
    Conditional,
    Comparison,
    While,
    WhileTrue,
    Continue,
    Scope,
    IndexedSymbol,
    Math,
    Array
};