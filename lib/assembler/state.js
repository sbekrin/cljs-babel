class State {
    constructor() {
        this.namespace = '';
        this.scopeNames = true;
        this.scopes = [[]];
    }

    /**
     * Generates symbol name with scope included
     * @param {string} name
     */
    scopedName(name) {
        name = this.makeSafe(name);

        if (!this.scopeNames) {
            return name;
        }

        // Namespaced name
        if (name.indexOf('/') > -1) {
            if (name.indexOf('js/') > -1) {
                return name.replace('js/', '');
            }

            return name.replace('/', '.');
        }

        const dotIndex = name.indexOf('.');

        // Accessor or function call on object
        if (dotIndex === 0) {
            return name
        }

        let localName = null;

        if (dotIndex > -1) {
            localName = name.slice(0, dotIndex);
        } else {
            localName = name;
        }

        for (var i = 0; i < this.scopes.length; i++) {
            if (this.scopes[i].indexOf(localName) > -1) {
                return (
                    i === this.scopes.length - 1 ?
                    `${this.namespace}.${name}` :
                    name
                );
            }
        }

        return name;
    }

    /**
     * Adds defenition to current scope
     * @param {string} name
     * @return {string}
     */
    addDefinition(name) {
        this.scopes[0].push(name);
        return name;
    }

    /**
     * Creates new scope
     */
    createScope() {
        this.scopes.unshift([]);
    }

    /**
     * Destroys scope at top of stack
     */
    destroyScope() {
        this.scopes = this.scopes.slice(1);
    }

    /**
     * Converts string to ES-compatible format
     * @param {string} value
     * @return {string}
     */
    makeSafe(value) {
        return value
            .replace(/^\.-/, '.') // Keep property accessor name same
            .replace(/-\w/g, (match) => match[1].toUpperCase()) // Convert kebab-case to camelCase
            .replace(/-/g, '_')
            .replace(/\+/g, '_PLUS_')
            .replace(/\*/g, '_STAR_')
            .replace(/!/g, '_BANG_')
            .replace(/=/g, '_EQ_')
            .replace(/\?/g, '_QMARK_');
    }
}

module.exports = State;