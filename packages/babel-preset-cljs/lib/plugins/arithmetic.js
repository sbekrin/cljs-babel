// todo: defn, defn-, let, letfn, declare, ns
// todo: quot, rem, mod, inc, dec, max, min
module.exports = function arithmetic(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      CallExpression(path) {
        const { node } = path;
        if (t.isIdentifier(node.callee)) {
          const operator = node.callee.name;
          const values = node.arguments;
          switch (operator) {
            case '+':
            case '-':
            case '*':
            case '/':
              if (values.length === 0) {
                path.replaceWith(t.binaryExpression(1));
                break;
              }
              let expression = t.binaryExpression(
                operator,
                values[0],
                values[1]
              );
              if (values.length > 2) {
                values.slice(2, values.length).forEach(node => {
                  expression = t.binaryExpression(operator, expression, node);
                });
              }
              path.replaceWith(t.parenthesizedExpression(expression));
              break;
          }
        }
      },
    },
  };
};
