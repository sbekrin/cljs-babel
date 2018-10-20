// todo: defmacro, defmethod, defmulti, defn, defn-, defonce, defprotocol, defrecord, deftype
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
                  [name] = node.arguments;
                  value = t.nullLiteral();
                  break;
                case 2:
                  [name, value] = node.arguments;
                  break;
                case 3:
                  [name, doc, value] = node.arguments;
                  break;
                default:
                  throw new Error('Invalid arity for def');
              }
              const nextNode = t.variableDeclaration('var', [
                t.variableDeclarator(name, value),
              ]);
              // Insert doc string as a leading comment if set
              if (doc) {
                nextNode.leadingComments = [
                  { type: 'CommentBlock', value: `* ${doc.value} ` },
                ];
              }
              path.parentPath.replaceWith(nextNode);
              break;
            }
            case 'defmacro': {
              let name;
              let doc;
              let attrs;
              let params;
              let body;
              switch (node.arguments.length) {
                case 3:
                  [doc, attrs, params, body] = node.arguments;
                  break;
                case 2:
              }
              break;
            }
          }
        }
      },
    },
  };
};
