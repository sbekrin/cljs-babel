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

        // TODO: what if keyword has /?
        // TODO: what is thrid argument?
        case l.KeywordNode:
            return t.newExpression(
                t.identifier('Keyword'),
                [
                    t.nullLiteral(),
                    t.stringLiteral(node.name),
                    t.stringLiteral(node.name)
                ]
            );

        // TODO: what is magic third argument?
        case l.VectorNode:
            return t.newExpression(
                t.identifier('PersistentVector'),
                [
                    t.nullLiteral(),
                    t.numericLiteral(node.values.length),
                    t.numericLiteral(5),
                    t.memberExpression(t.identifier('PersistentVector'), t.identifier('EMPTY_NODE')),
                    t.arrayExpression(node.values.map(translate)),
                    t.nullLiteral()
                ]
            );

        case l.ListNode:
            return translateList(node);

        case l.MapNode:
        case l.SetNode:
            return node; // TODO: List / Map / Set

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
            throw new Error(`Compile error, unknown node type ${node}`);
    }
}

function translateList(node) {
    const functionName = node.values[0].value;

    switch (functionName) {
        case 'ns': {
            return;
        }

        case 'def': {
            const variableName = node.values[1];
            const variableValue = node.values[2];

            return t.variableDeclaration('var', [
                t.variableDeclarator(
                    translate(variableName),
                    translate(variableValue)
                )]
            );
        }

        case 'defn': {
            return;
        }

        case 'fn': {
            const args = node.values[1].values
                .map((arg) => translate(arg));
            const body = node.values
                .slice(2, node.values.length)
                .map((node) => translate(node))
                .map((expression) => t.expressionStatement(expression));

            return t.functionExpression(
                null,
                args,
                t.blockStatement(body)
            );
        }

        default:
            const isPropertyAccesor = functionName.startsWith('.-');
            const isObjectMethodCall = (
                !isPropertyAccesor &&
                functionName.startsWith('.')
            );
            const isNewObjectInstantiation = functionName.endsWith('.');
            const isFunctionCall = !(
                isPropertyAccesor ||
                isObjectMethodCall ||
                isNewObjectInstantiation
            );

            // TODO
            if (isPropertyAccesor) {
                return;
            }
            
            if (isObjectMethodCall) {
                const args = node.values
                    .slice(2, node.values.length)
                    .map((arg) => translate(arg));

                return t.callExpression(
                    t.memberExpression(
                        translate(node.values[1]),
                        translate(node.values[0])
                    ),
                    args
                );
            }
            
            // TODO
            if (isNewObjectInstantiation) {
                return;
            }
            
            if (isFunctionCall) {
                const args = node.values.map((arg) => translate(arg));

                return t.callExpression(
                    t.memberExpression(
                        t.identifier(functionName),
                        t.identifier('call')
                    ),
                    [ t.nullLiteral() ].concat(args)
                );
            }
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