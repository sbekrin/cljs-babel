// todo: def, defmacro, defmethod, defmulti, defn, defn-, defonce, defprotocol, defrecord, deftype
// todo: let, letfn, declare, ns
module.exports = function defToVar(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      CallExpression(path) {
        const { node } = path;
        if (t.isIdentifier(node.callee)) {
          switch (node.callee.name) {
            case 'def': {
              let name;
              let value;
              let doc;
              switch (node.arguments.length) {
                case 1:
                  name = node.arguments[0];
                  value = t.nullLiteral();
                  break;
                case 2:
                  name = node.arguments[0];
                  value = node.arguments[1];
                  break;
                case 3:
                  name = node.arguments[0];
                  // TODO: keep doc as a comment
                  doc = node.arguments[1];
                  value = node.arguments[2];
                  break;
                default:
                  throw new Error('Invalid arity for def');
              }
              path.parentPath.replaceWith(
                t.variableDeclaration('var', [
                  t.variableDeclarator(name, value),
                ])
              );
              break;
            }
          }
        }
      },
    },
  };
};
