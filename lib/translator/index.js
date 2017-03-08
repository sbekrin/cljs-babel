const through = require('through');
const t = require('babel-types');
const { transformFromAst } = require('babel-core');
const { generateVariableName } = require('./utils');
const l = require('../language');

function translate(node) {
    if (!node) {
        return null;
    }

    switch (node.constructor) {
        case l.ProgramNode:
            return t.file(t.program(translate(node.program)), [], node);

        case l.CommentNode:
            return;

        case l.LeafNode:
            return [ translate(node.left), translate(node.right) ];

        case l.SymbolNode:
            return t.identifier(node.value);

        case l.KeywordNode:
            return; // TODO: Keyword

        case l.ListNode:
        case l.VectorNode:
        case l.MapNode:
        case l.SetNode:
            return; // TODO: List / Vector / Map / Set

        case l.StringNode:
        case l.CharacterNode:
            return t.stringLiteral(node.value);

        case l.BooleanNode:
            return t.booleanLiteral(node.value);

        case l.Number:
            return t.numericLiteral(node.value);

        case l.NaNNode:
            return t.identifier('NaN');

        case l.InfinityNode:
            return (
                node.negative ?
                t.unaryExpression('-', t.identifier('Infinity')) :
                t.identifier('Infinity')
            );

        case l.NullNode:
            return t.nullLiteral();

        case l.RegExpNode:
            return; // TODO: RegExp

        default:
            throw new Error(`Compile error, unknown node type ${node.constructor.toString()}`);
    }
}

function translateList(node) {
    const leftNode = node.left;

    if (!leftNode) {
        return [];
    }

    const isLeaf = leftNode.left.type === 'leaf';
    const isSymbol = isLeaf && leftNode.left.left.type === 'symbol';

    if (isSymbol) {
        const left = translate(leftNode.left);
        const functionName = left.name;

        switch (functionName) {
            // TODO: Namespace
            case 'ns':
                // return [ new lang.Namespace(translate(leftNode.right.left)) ];
                return [];

            // Variable defenition
            case 'def':
                return [ t.variableDeclaration('var', [
                    t.variableDeclarator(
                        t.identifier(leftNode.right.left.left.value),
                        translate(leftNode.right.right)[0]
                    )]
                )];

            // Function defenition
            case 'defn':
                return [ t.variableDeclaration('var', [
                    t.variableDeclarator(
                        t.identifier(leftNode.right.left.left.value),
                        t.functionExpression(
                            t.identifier(leftNode.right.left.left.value),
                            translate(leftNode.right.right.left.left).concat(translate(leftNode.right.right.left.right)),
                            translate(leftNode.right.right.right)
                        )
                    )]
                )];

            // Anonymus function defenition
            case 'fn':
                return [ new lang.Lambda(
                    translate(leftNode.right.left.left).concat(translate(leftNode.right.left.right)),
                    translate(leftNode.right.right)
                )];

            case 'set!':
                return [ new lang.Assign(
                    translate(leftNode.right.left),
                    translate(leftNode.right.right)
                )];

            case 'if':
                return [ new lang.Conditional(
                    translate(leftNode.right.left),
                    translate(leftNode.right.right.left),
                    translate(leftNode.right.right.right)
                )];

            case 'if-not':
                return [ new lang.Conditional(
                    [ new lang.Invoke(
                        [ new lang.Symbol('not') ],
                        translate(leftNode.right.left)
                    )],
                    translate(leftNode.right.right.left),
                    translate(leftNode.right.right.right)
                )];

            case 'if-let': {
                const decs = translate(leftNode.right.left.left);
                const tempVar = [ new lang.Symbol(generateVariableName('ifLet')) ];
                const vars = [ new lang.Variable(tempVar, [decs[1]]) ];
                const assign = [ new lang.Variable([decs[0]], tempVar) ];
                const condition = [
                    new lang.Conditional(
                        tempVar,
                        assign.concat(translate(leftNode.right.right.left)),
                        translate(leftNode.right.right.right)
                    )
                ];
                return vars.concat(condition);
            }

            case 'when':
                return [ new lang.Conditional(
                    translate(leftNode.right.left),
                    translate(leftNode.right.right),
                    []
                )];

            case 'do':
                return translate(leftNode.right);

            case '<':
            case '>':
            case '<=':
            case '>=':
            case '==':
                return [ new lang.Comparison(
                    left,
                    translate(leftNode.right.left),
                    translate(leftNode.right.right)
                )];

            case 'not=':
                return [ new lang.Comparison(
                    [ new lang.Symbol('!==') ],
                    translate(leftNode.right.left),
                    translate(leftNode.right.right)
                )];

            case 'and': {
                const decs = translate(leftNode.right);

                function consequent(index) {
                    const tempSym = [ new lang.Symbol(generateVariableName('and')) ];
                    const tempVar = [ new lang.Variable(tempSym, [ decs[index] ]) ];
                    const conditional = (
                        decs[index + 2] ?
                        [ new lang.Conditional(tempSym, consequent(index + 1), tempSym) ] :
                        [ new lang.Conditional(tempSym, [decs[index + 1]], tempSym) ]
                    );

                    return tempVar.concat(conditional);
                }

                return consequent(0);
            }

            case 'or': {
                const decs = translate(leftNode.right);

                function alternative(index) {
                    const tempSym = [ new lang.Symbol(generateVariableName('or')) ];
                    const tempVar = [ new lang.Variable(tempSym, [ decs[index] ]) ];
                    const conditional = (
                        decs[index + 2] ?
                        [ new lang.Conditional(tempSym, tempSym, alternative(index + 1)) ] :
                        [ new lang.Conditional(tempSym, tempSym, [ decs[index + 1] ]) ]
                    );

                    return tempVar.concat(conditional);
                }

                return alternative(0);
            }

            case 'let': {
                const decs = translate(leftNode.right.left.left).concat(translate(leftNode.right.left.right));
                const vars = [];
                const isOdd = (_, index) => index % 2 === 0;

                decs.filter(isOdd).forEach((dec, i) => {
                    vars.push(new lang.Variable([ decs, [ decs[i + 1] ]]));
                });

                return vars.concat(translate(leftNode.right.right));
            }

            case 'loop': {
                const decs = translate(leftNode.right.left.left).concat(translate(leftNode.right.left.right));
                const vars = [];
                const isOdd = (_, index) => index % 2 === 0;

                decs.filter(isOdd).forEach((dec, i) => {
                    vars.push(new lang.Variable([ decs, [ decs[i + 1] ]]));
                });

                const scope = new lang.Scope(vars.concat([
                    new lang.WhileTrue(translate(leftNode.right.right))
                ]));

                return [ scope ];
            }

            case 'recur': {
                const assigns = translate(leftNode.right).map((value, i) => (
                    new lang.Assign([ new lang.IndexedSymbol(i) ], [ value ])
                ));

                return assigns.concat([ new lang.Continue() ]);
            }

            case '+':
            case '-':
            case '*':
            case '/':
                return [ new lang.Math(
                    left,
                    translate(leftNode.right.left),
                    translate(leftNode.right.right)
                )];

            case 'inc':
                return [ new lang.Math(
                    [ new lang.Symbol('+') ],
                    translate(leftNode.right.left),
                    [ new lang.Number(1) ]
                )];

            case 'dec':
                return [ new lang.Math(
                    [ new lang.Symbol('-') ],
                    translate(leftNode.right.left),
                    [ new lang.Number(1) ]
                )];

            case 'str':
                return [ new lang.Symbol('"" + '),
                    [ translate(leftNode.right.left) ]
                ];

            default:
                if (functionName.indexOf('.-') === 0) {
                    return [ new lang.Accessor(translate(leftNode.right.left), left) ];
                } else if (functionName[0] === '.') {
                    return [ new lang.Invoke(
                        translate(leftNode.right.left).concat(left),
                        translate(leftNode.right.right)
                    )];
                }

                return [ new lang.Invoke(left, translate(leftNode.right)) ];
        }
    } else {
        return translate(leftNode.left).concat(translate(leftNode.right));
    }
}

let vectorIndex = 0;

function translateVector(node) {
    return [
        new lang.New(
            [ new lang.Symbol('PersistentVector') ],
            [
                new lang.Symbol('js/null'),
                new lang.Number(++vectorIndex),
                new lang.Number(5),
                new lang.Symbol('PersistentVector.EMPTY_NODE'),
            ].concat(
                new lang.Array(translate(node.left).concat(translate(node.right)))
            ).concat(
                [ new lang.Symbol('js/null') ]
            )
        )
    ];
}

function translateKeyword(node) {
    return [
        new lang.New(
            [ new lang.Symbol('Keyword') ],
            [
                new lang.Symbol('js/null'),
                new lang.String(node.value.replace(':', '')),
                new lang.String(node.value.replace(':', ''))
            ]
        )
    ];
}

function macro(node) {
    switch (node.left.left.type) {
        case 'deref':
            return [ new lang.Invoke(
                [ new lang.Symbol('deref') ],
                translate(node.right)
            )];

        case 'dispatch':
            switch (node.left.left.value) {
                case '#_':
                    return [];

                case '#':
                    return [ new lang.Lambda(
                        resolvePlaceholders(node),
                        translate(node.right)
                    )];
            }
    }

    return [];
}

function resolvePlaceholders(node, args = []) {
    if (!node) {
        return args;
    }

    const isLeaf = node.type === 'leaf';
    const isSymbol = isLeaf && node.left.type === 'symbol';
    const isArgumentSyntax = isSymbol && node.left.value[0] === '%';

    if (isArgumentSyntax) {
        const indexRegex = /^%([0-9]*|&)$/;
        const result = indexRegex.exec(node.left.value)
        let index = result[1] || 0;

        if (index === '&') {
            node.left.value = 'arguments';
        } else {
            index = parseInt(index, 10);

            for (let i = 0; i < index + 1; i++) {
                args[i] = args[i] || new lang.Symbol(generateVariableName(`p${i}`));
            }

            node.left.value = args[index].name;
        }
    } else {
        resolvePlaceholders(node.left, args);
        resolvePlaceholders(node.right, args);
    }

    return args;
}

function createTranslator() {
    function write(data) {
        this.queue({
            code: data.code,
            ast: translate(data.ast)
        });
    }

    return through(write, null, { objectMode: true });
}

module.exports = createTranslator;