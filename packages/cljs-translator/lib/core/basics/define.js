const t = require('babel-types');
const { toFlat } = require('@cljs/helpers');

function translateDefineList(node) {
    return (translate) => {
        switch (node.values[0].value) {
            case 'def': {
                let name;
                let value;
                let doc;

                switch (node.values.length) {
                    case 2:
                        name = translate(node.values[1]);
                        value = t.nullLiteral();
                        break;

                    case 3:
                        name = translate(node.values[1]);
                        value = translate(node.values[2]);
                        break;

                    case 4:
                        name = translate(node.values[1]);
                        doc = translate(node.values[2]); // TODO: keep doc as comment?
                        value = translate(node.values[3]);
                        break;
                    
                    default:
                        throw new Error('Invalid arity for def');
                }

                return t.variableDeclaration('var', [
                    t.variableDeclarator(
                        toFlat(name),
                        toFlat(value)
                    )]
                );
            }

            case 'defn':
            case 'defn-':
            case 'let':
            case 'letfn':
            case 'declare':
            case 'ns':
                throw new Error('Not implemented');

            default:
                return null;
        }
    };
}

module.exports = translateDefineList;