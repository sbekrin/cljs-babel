// todo: defn, identity, constantly, comp, complement, partial, juxt, memoize, fnil, every-pred, some-fn
// todo: apply, ->, ->>, as->, cond->, cond->>, some->, some->>
module.exports = function fnToFunction(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      CallExpression(path) {
        const { node } = path;
        if (t.isIdentifier(node.callee) && node.callee.name === 'fn') {
          const [args, ...body] = node.arguments;
          path.parentPath.replaceWith(
            t.functionExpression(
              null,
              args.elements,
              t.blockStatement(
                body.map((element, index) => {
                  const isLast = index === body.length - 1;
                  return isLast
                    ? t.returnStatement(element)
                    : t.expressionStatement(element);
                })
              )
            )
          );
        }
      },
    },
  };
};
