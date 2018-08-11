const t = require('babel-types');
const l = require('@cljs/types');
const { toFlat, resolveSymbol } = require('@cljs/helpers');

function translate(node) {
  if (!node) {
    return null;
  }
  switch (node.constructor) {
    case l.ProgramNode: {
      const program = translate(node.program).map(
        node => (t.isStatement(node) ? node : t.expressionStatement(node))
      );
      return t.file(t.program(program, []), node);
    }
    case l.LeafNode:
      return translate(node.left).concat(translate(node.right));
    case l.SymbolNode:
      return t.identifier(resolveSymbol(node.value));
    case l.KeywordNode:
      return t.newExpression(t.identifier('Keyword'), [
        // TODO: what if keyword has namespace?
        // TODO: what should be 4th argument?
        t.nullLiteral(),
        t.stringLiteral(node.name),
        t.stringLiteral(node.name),
      ]);
    case l.VectorNode: {
      return t.arrayExpression(node.values.map(translate));
      /*
      // See https://cljs.github.io/api/cljs.core/PersistentVector
      return t.newExpression(t.identifier('PersistentVector'), [
        t.nullLiteral(),
        t.numericLiteral(node.values.length),
        t.numericLiteral(5),
        t.memberExpression(
          t.identifier('PersistentVector'),
          t.identifier('EMPTY_NODE')
        ),
        t.arrayExpression(values),
        t.nullLiteral(),
      ]);
      */
    }
    case l.FormNode:
      return node.values.length > 0 ? [translateForm(node)] : [];
    case l.ListNode:
    case l.VectorNode:
    case l.MapNode:
    case l.SetNode:
    case l.RegExpNode:
      throw new Error('Not implemented');
    case l.StringNode:
    case l.CharacterNode:
      return t.stringLiteral(node.value);
    case l.BooleanNode:
      return t.booleanLiteral(node.value);
    case l.NumberNode:
      return t.numericLiteral(node.value);
    case l.NaNNode:
      return t.identifier('NaN');
    case l.InfinityNode:
      return node.negative
        ? t.unaryExpression('-', t.identifier('Infinity'))
        : t.identifier('Infinity');
    case l.NullNode:
      return t.nullLiteral();
    default:
      throw new Error(
        `Compile error, unknown node type ${node.constructor.name}`
      );
  }
}

function translateForm(node) {
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

module.exports = { translate };
