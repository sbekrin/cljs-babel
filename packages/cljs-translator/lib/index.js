const invariant = require('invariant');
const t = require('babel-types');
const l = require('@cljs/types');
const {
  toFlat,
  isEven,
  resolveSymbol,
  resolveKeyword,
} = require('@cljs/helpers');

function translate(node) {
  if (!node) {
    return null;
  }
  switch (node.constructor) {
    case l.ProgramNode: {
      const root = translate(node.program);
      const program = Array.isArray(root) ? root : [root];
      return t.file(
        t.program(
          program.map(
            node => (t.isStatement(node) ? node : t.expressionStatement(node))
          ),
          []
        ),
        node
      );
    }
    // (())
    case l.LeafNode:
      return translate(node.left).concat(translate(node.right));
    // ()
    case l.ListNode: {
      if (!node.values.length) {
        return [];
      }
      const firstSymbol = node.values[0].value;
      // (.- foo bar) -> bar.foo
      if (firstSymbol.startsWith('.-')) {
        return t.memberExpression(
          translate(node.values[1]),
          t.identifier(resolveSymbol(firstSymbol))
        );
      }
      // (.foo bar) -> bar.foo()
      if (firstSymbol.startsWith('.')) {
        const object = translate(node.values[1]);
        const method = translate(node.values[0]);
        const args = node.values
          .slice(2, node.values.length)
          .map(arg => toFlat(translate(arg)));
        return t.callExpression(t.memberExpression(object, method), args);
      }
      // (String. "hey") -> new String('hey')
      if (firstSymbol.endsWith('.')) {
        const args = node.values
          .slice(1, node.values.length)
          .map(arg => toFlat(translate(arg)));
        return t.newExpression(t.identifier(resolveSymbol(firstSymbol)), args);
      }
      // (foo bar baz) -> foo(bar, baz)
      const args = node.values
        .slice(1, node.values.length)
        .map(arg => toFlat(translate(arg)));
      return t.callExpression(t.identifier(firstSymbol), args);
    }
    // foo -> foo
    case l.SymbolNode:
      return t.identifier(resolveSymbol(node.value));
    // :foo -> 'foo'
    case l.KeywordNode:
      return t.stringLiteral(node.name);
    // [1 2 3] -> [1, 2, 3]
    case l.VectorNode: {
      return t.arrayExpression(node.values.map(translate));
    }
    // {:foo 1, :bar 2} -> new Map([['foo', 1], ['bar', 2]])
    case l.MapNode:
      invariant(
        isEven(node.values.length),
        'Map literal must contain an even number of forms'
      );
      const values = node.values.map(translate);
      return t.newExpression(t.identifier('Map'), [
        t.arrayExpression(
          values.reduce(
            (acc, current, index) =>
              isEven(index)
                ? acc.concat(t.arrayExpression([current, values[index + 1]]))
                : acc,
            []
          )
        ),
      ]);
    // #{1 2 3} -> new Set([1, 2, 3])
    case l.SetNode:
      return t.newExpression(t.identifier('Set'), [
        t.arrayExpression(node.values.map(translate)),
      ]);
    // todo:
    case l.RegExpNode:
      throw new Error('RegExp is not implemented');
    // "foo" -> 'foo'
    // 'f' -> 'f'
    case l.StringNode:
    case l.CharacterNode:
      return t.stringLiteral(node.value);
    // true -> true
    case l.BooleanNode:
      return t.booleanLiteral(node.value);
    // 42 -> 42
    case l.NumberNode:
      return t.numericLiteral(node.value);
    // NaN -> NaN
    case l.NaNNode:
      return t.identifier('NaN');
    // Infinity -> InfinityNode
    case l.InfinityNode:
      return node.negative
        ? t.unaryExpression('-', t.identifier('Infinity'))
        : t.identifier('Infinity');
    // nil -> null
    case l.NullNode:
      return t.nullLiteral();
    default:
      throw new Error(
        `Compile error, unknown node type ${node.constructor.name}`
      );
  }
}

module.exports = { translate };
