const t = require('babel-types');
const l = require('cljs-types');
const translateCore = require('./core');
const { toFlat } = require('../utils');

function escape(value = '') {
    return value
        .replace(/^\.\-/, '')
        .replace(/\./, '');
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

        // TODO: Map / Set
        case l.MapNode:
        case l.SetNode:
            return [];

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
    // Possible core function call
    const possibleCoreTranslation = translateCore(node, translate);


    if (possibleCoreTranslation) {
        return possibleCoreTranslation;
    }

    const firstSymbol = node.values[0].value;

    // Property accesor
    if (firstSymbol.startsWith('.-')) {
        const path = node.values[0].value.replace(/^\.\-/, '');

        return t.memberExpression(
            translate(node.values[1]),
            t.identifier(path)
        );
    }

    // Object method call
    if (firstSymbol.startsWith('.')) {
        const object = translate(node.values[1]);
        const method = translate(node.values[0]);
        const args = node.values
            .slice(2, node.values.length)
            .map((arg) => toFlat(translate(arg)));

        return t.callExpression(t.memberExpression(object, method), args);
    }

    // TODO: New object instantiation
    if (firstSymbol.endsWith('.')) {
        throw new Error('Not implemented');
    }

    // Function call
    const args = node.values
        .slice(1, node.values.length)
        .map((arg) => toFlat(translate(arg)));

    return t.callExpression(t.identifier(firstSymbol), args);
}

module.exports = translate;