const { transformFromAst } = require('babel-core');
const translate = require('./internal');

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

function translatorProxy(data) {
    return {
        sourceCode: data.sourceCode,
        ast: translate(data.ast)
    };
}

module.exports = translatorProxy;