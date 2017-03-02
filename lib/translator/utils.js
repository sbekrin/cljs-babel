let latestIndex = 0;

module.exports.generateVariableName = (seed = '') => {
    return `${seed}var${++latestIndex}`;
};