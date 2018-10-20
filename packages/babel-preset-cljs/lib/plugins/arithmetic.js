const { resolveSymbol } = require('@cljs/helpers');

module.exports = function arithmetic(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      CallExpression(path) {
        const { node } = path;
        if (t.isIdentifier(node.callee)) {
          const fn = node.callee.name;
          const values = node.arguments;
          switch (fn) {
            // (+ a b) -> (a + b)
            case resolveSymbol('+'):
            case resolveSymbol('-'):
            case resolveSymbol('*'):
            case resolveSymbol('/'): {
              if (values.length === 0) {
                path.replaceWith(t.binaryExpression(1));
                break;
              }
              const operator = {
                [resolveSymbol('+')]: '+',
                [resolveSymbol('-')]: '-',
                [resolveSymbol('*')]: '*',
                [resolveSymbol('/')]: '/',
              }[fn];
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
            // (quot n d) -> parseInt(Math.trunc(n / d))
            case 'quot': {
              const [numerator, denominator] = node.arguments;
              path.replaceWith(
                t.callExpression(t.identifier('parseInt'), [
                  t.callExpression(
                    t.memberExpression(
                      t.identifier('Math'),
                      t.identifier('trunc')
                    ),
                    [t.binaryExpression('/', numerator, denominator)]
                  ),
                ])
              );
              break;
            }
            // (rem n d) -> (n % d)
            case 'rem': {
              const [numerator, denominator] = node.arguments;
              path.replaceWith(
                t.parenthesizedExpression(
                  t.binaryExpression('%', numerator, denominator)
                )
              );
              break;
            }
            // (mod n d) -> (((n % d) + d) % d)
            case 'mod': {
              const [numerator, denominator] = node.arguments;
              path.replaceWith(
                t.parenthesizedExpression(
                  t.binaryExpression(
                    '%',
                    t.binaryExpression(
                      '+',
                      t.binaryExpression('%', numerator, denominator),
                      denominator
                    ),
                    denominator
                  )
                )
              );
              break;
            }
            // (inc n) -> (n + 1)
            // (dec n) -> (n - 1)
            case 'inc':
            case 'dec': {
              const operator = fn === 'inc' ? '+' : '-';
              const [value] = node.arguments;
              path.replaceWith(
                t.parenthesizedExpression(
                  t.binaryExpression(operator, value, t.identifier('1'))
                )
              );
              break;
            }
            // (max 1 2 3) -> Math.max(1, 2, 3)
            // (min 1 2 3) -> Math.min(1, 2, 3)
            case 'max':
            case 'min': {
              path.replaceWith(
                t.callExpression(
                  t.memberExpression(t.identifier('Math'), t.identifier(fn)),
                  node.arguments
                )
              );
              break;
            }
          }
        }
      },
    },
  };
};
