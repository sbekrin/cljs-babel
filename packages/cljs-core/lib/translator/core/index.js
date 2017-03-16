const basics = require('./basics');
const collections = []; // TODO
const sequences = []; // TODO
const misc = []; // TODO
const translators = basics
    .concat(collections)
    .concat(sequences)
    .concat(misc);

function translateCore(node, translate) {
    let index = 0;

    while (index < translators.length) {
        const result = translators[index](node)(translate);

        if (result) {
            return result;
        }

        index++;
    }

    return null;
}

module.exports = translateCore;