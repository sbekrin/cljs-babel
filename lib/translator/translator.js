const t = require('babel-types');
const { transformFromAst } = require('babel-core');
const l = require('../language');

function escape(value = '') {
    return value
        .replace(/^\.\-/, '')
        .replace(/\./, '');
}

function getFlat(node) {
    return Array.isArray(node) ? node[0] : node;
}

function returnIfLast(cljsNode) {
    return (babelNode) => {
        return cljsNode.last ? t.returnStatement(babelNode) : babelNode;
    };
}

function translate(node) {
    if (!node) {
        return null;
    }

    switch (node.constructor) {
        case l.ProgramNode:
            const program = translate(node.program)
                .map((node) => (
                    t.isStatement(node) ?
                    node :
                    t.expressionStatement(node)
                ));

            return t.file(t.program(program, []), node);

        case l.LeafNode:
            return translate(node.left).concat(translate(node.right));

        case l.SymbolNode:
            return returnIfLast(node)(t.identifier(escape(node.value)));

        case l.KeywordNode:
            return returnIfLast(node)(t.newExpression(
                t.identifier('Keyword'),
                [
                    // TODO: what if keyword has namespace?
                    // TODO: what should be 4th argument?
                    t.nullLiteral(),
                    t.stringLiteral(node.name),
                    t.stringLiteral(node.name)
                ]
            ));

        case l.VectorNode:
            const values = node.values.map((value) => translate(value));

            return returnIfLast(node)(t.newExpression(
                t.identifier('PersistentVector'),
                [
                    // TODO: what is magic 3d argument?
                    t.nullLiteral(),
                    t.numericLiteral(node.values.length),
                    t.numericLiteral(5),
                    t.memberExpression(
                        t.identifier('PersistentVector'),
                        t.identifier('EMPTY_NODE')
                    ),
                    t.arrayExpression(values),
                    t.nullLiteral()
                ]
            ));

        case l.ListNode:
            return [ translateList(node) ];

        case l.MapNode:
        case l.SetNode:
            return []; // TODO: List / Map / Set

        case l.StringNode:
        case l.CharacterNode:
            return returnIfLast(node)(
                t.stringLiteral(node.value)
            );

        case l.BooleanNode:
            return returnIfLast(node)(
                t.booleanLiteral(node.value)
            );

        case l.NumberNode:
            return returnIfLast(node)(
                t.numericLiteral(node.value)
            );

        case l.NaNNode:
            return returnIfLast(node)(
                t.identifier('NaN')
            );

        case l.InfinityNode:
            return returnIfLast(node)(
                node.negative ?
                t.unaryExpression('-', t.identifier('Infinity')) :
                t.identifier('Infinity')
            );

        case l.NullNode:
            return returnIfLast(node)(
                t.nullLiteral()
            );

        // TODO: RegExp
        case l.RegExpNode:
            return returnIfLast(node)([]);

        default:
            throw new Error(`Compile error, unknown node type ${node}`);
    }
}

function translateList(node) {
    const functionName = node.values[0].value;

    switch (functionName) {
        case 'ns': {
            // TODO: Add namespace as module meta
            return;
        }

        case 'def': {
            const name = translate(node.values[1]);
            const value = translate(node.values[2]);

            return t.variableDeclaration('var', [
                t.variableDeclarator(
                    getFlat(name),
                    getFlat(value)
                )]
            );
        }

        // TODO
        case 'defn': {
            return;
        }

        case 'fn': {
            const args = node.values[1].values.map((arg) => translate(arg));
            const bodyNodes = node.values.slice(2, node.values.length);
            const lastNodeIndex = bodyNodes.length - 1;
            const body = bodyNodes
                .map((node) => getFlat(translate(node)))
                .map((expression, index) => (
                    lastNodeIndex === index ?
                    t.returnStatement(expression) :
                    t.expressionStatement(expression)
                ));

            return t.functionExpression(null, args, t.blockStatement(body));
        }

        case 'str': {
            const values = node.values
                .slice(1, node.values.length)
                .map((value) => getFlat(translate(value)));

            return t.callExpression(
                t.memberExpression(
                    t.arrayExpression(values),
                    t.identifier('join')
                ),
                [ t.stringLiteral('') ]
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

            if (isPropertyAccesor) {
                const path = node.values[0].value.replace(/^\.\-/, '');

                return t.memberExpression(
                    translate(node.values[1]),
                    t.identifier(path)
                );
            }
            
            if (isObjectMethodCall) {
                const object = translate(node.values[1]);
                const method = translate(node.values[0]);
                const args = node.values
                    .slice(2, node.values.length)
                    .map((arg) => getFlat(translate(arg)));

                return t.callExpression(
                    t.memberExpression(object, method),
                    args
                );
            }

            // TODO
            if (isNewObjectInstantiation) {
                return;
            }

            if (isFunctionCall) {
                const args = node.values
                    .slice(1, node.values.length)
                    .map((arg) => getFlat(translate(arg)));

                return t.callExpression(
                    t.identifier(functionName),
                    args
                );
            }
    }
}

// TODO
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

// TODO
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

function translateAst(data) {
    return {
        sourceCode: data.sourceCode,
        babelAst: translate(data.cljsAst)
    };
}

module.exports = translateAst;