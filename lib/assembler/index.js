const stream = require('stream');
const State = require('./state');
const lang = require('../language');
const Transform = stream.Transform;

class Assembler extends Transform {
    /**
     * @param {stream.TransformOptions} options
     */
    constructor(options = {}) {
        options.objectMode = true;
        super(options);
        this.state = new State();
    }

    /**
     * @param {string} chunk
     * @param {string} encoding
     * @param {Function} done
     */
    _transform(chunk, encoding, done) {
        this.assemble(chunk);
        done();
    }

    /**
     * @param {Function} done
     * @private
     */
    _flush(done) {
        done();
    }

    /**
     * Generates body functions
     * @param {lang.Function|lang.Lambda} type
     * @private
     */
    _generateFunctionBody(type) {
        const lastIndex = type.args.length - 1;

        this.state.createScope();
        type.args.forEach((argument, index) => {
            this.assemble([ argument ]);
            this.state.addDefinition(argument.name);
            if (index < lastIndex) {
                this.push(', ');
            }
        });
        this.push(') {\n');
        this.assembleAll(type.body, ';\n');
    }

    /**
     * Converts AST translation to JavaScript code
     * @param {Array} translation
     */
    assemble(translation) {
        translation.forEach((token) => {
            switch (token.constructor) {
                case lang.Function:
                    return this.generateFunction(token);
                case lang.Lambda:
                    return this.generateLambda(token);
                case lang.Variable:
                    return this.generateVariable(token);
                case lang.Invoke:
                    return this.generateInvoke(token);
                case lang.New:
                    return this.generateNew(token);
                case lang.Accessor:
                    return this.generateAccessor(token);
                case lang.Keyword:
                    return this.generateKeyword(token);
                case lang.Symbol:
                    return this.generateSymbol(token);
                case lang.String:
                    return this.generateString(token);
                case lang.Number:
                case lang.Boolean:
                    return this.generateNumberOrBoolean(token);
                case lang.Namespace:
                    return this.generateNamespace(token);
                case lang.Assign:
                    return this.generateAssign(token);
                case lang.Conditional:
                    return this.generateCondition(token);
                case lang.Comparison:
                    return this.generateComparison(token);
                case lang.While:
                    return this.generateWhile(token);
                case lang.WhileTrue:
                    return this.generateWhileTrue(token);
                case lang.Continue:
                    return this.generateContinue();
                case lang.Scope:
                    return this.generateScope(token);
                case lang.IndexedSymbol:
                    return this.generateIndexedSymbol(token);
                case lang.Math:
                    return this.generateMathOperator(token);
                case lang.Array:
                    return this.generateArray(token);
                default:
                    throw new Error(`Compile error ${JSON.stringify(token)}`);
            }
        });

        return this;
    }

    /**
     * Assembles array of tokens
     * @param {Array} tokens
     * @param {string} separator
     */
    assembleAll(tokens, separator) {
        const lastIndex = tokens.length - 1;

        tokens.forEach((token, index) => {
            this.assemble([ token ]);

            if (separator && index < lastIndex) {
                this.push(separator);
            }
        });
    }

    /**
     * Generates regular named function
     * @param {lang.Function} token
     */
    generateFunction(token) {
        const functionName = this.state.makeSafe(token.name[0].name);
        const lastIndex = token.args.length - 1;

        this.state.addDefinition(functionName);
        this.assemble(token.name);
        this.push(` = function ${functionName}(`);
        this._generateFunctionBody(token);
        this.push('\n};\n');
        this.state.destroyScope();
    }

    /**
     * Generates anonymous function
     * @param {lang.Lambda} token
     */
    generateLambda(token) {
        token.last && this.push('return ');
        this.push('(function('); 
        this._generateFunctionBody(token);  
        this.push('})');
        this.state.destroyScope();
    }

    /**
     * Generates variable defenition
     * @param {lang.Variable} token
     */
    generateVariable(token) {
        const variableName = this.state.makeSafe(token.name[0].name);

        this.state.addDefinition(variableName);

        if (this.state.scopes.length > 1) {
            this.push(`var ${variableName}`);
        } else {
            this.push(`${this.state.namespace}.${variableName}`);
        }

        this.push(' = ');
        this.assemble(token.value);
    }

    /**
     * Generates invoke statement
     * @param {lang.Invoke} token
     */
    generateInvoke(token) {
        token.last && this.push('return ');

        if (token.name[0] instanceof lang.Symbol) {
            const functionName = this.state.scopedName(token.name[0].name);
            const namespaces = [ this.state.namespace ];
            let namespaced = false;

            // for (let i = 0; i < namespaces.length; i++) {
            //     if (functionName.indexOf(namespaces[i]) === 0) {
            //         namespaced = true;
            //         break;
            //     }
            // }

            this.assemble(token.name);

            if (namespaced) {
                this.push('.call(null');

                if (token.args.length) {
                    this.push(', ');
                }
            } else {
                this.push('(');
            }
        } else {
            this.assemble(token.name);
            this.push('(');
        }

        if (token.args.length) {
            const lastIndex = token.args.length - 1;

            token.args.forEach((argument, index) => {
                if (argument instanceof lang.Construct ||
                    argument instanceof lang.Variable) {
                    this.assemble([
                        new lang.Invoke([
                            new lang.Lambda([], argument)
                        ], [])
                    ]);
                } else {
                    this.assemble([ argument ]);
                }

                if (index < lastIndex) {
                    this.push(', ');
                }
            });
        }

        this.push(')');
    }

    /**
     * Generates instantiation statement
     * @param {lang.New} token
     */
    generateNew(token) {
        token.last && this.push('return ');
        this.push('new ');
        this.assemble(token.name);
        this.push('(');
        this.assembleAll(token.args, ', ');
        this.push(')');
    }

    /**
     * Generates accessor statement
     * @param {lang.Accessor} token
     */
    generateAccessor(token) {
        token.last && this.push('return ');
        this.assemble(token.object).assemble(token.property);
        token.last && this.push(';\n');
    }

    /**
     * Generates keyword
     * @param {lang.Keyword} token
     */
    generateKeyword(token) {
        this.push(this.state.makeSafe(token.name));
    }

    /**
     * Generates symbol
     * @param {lang.Symbol} token
     */
    generateSymbol(token) { 
        token.last && this.push('return ');
        this.push(this.state.scopedName(token.name));
    }

    /**
     * Generates string
     * @param {lang.String} token
     */
    generateString(token) {
        token.last && this.push('return ');
        const value = token.value.replace(/"/g, '\\"');
        this.push(`"${value}"`);
    }

    /**
     * Generate number or boolean
     * @param {lang.Number|lang.Boolean} token
     */
    generateNumberOrBoolean(token) {
        token.last && this.push('return ');
        this.push(token.value.toString());
    }

    /**
     * @param {lang.Namespace} token
     */
    generateNamespace(token) {
        this.state.namespace = this.state.makeSafe(token.name[0].name);
        this.state.scopes = [[]];
    }

    /**
     * @param {lang.Assign} token
     */
    generateAssign(token) {
        token.last && this.push('return ');
        this.assemble(token.name);
        this.push(' = ');
        this.assemble(token.value);
        this.push(';\n');
    }

    /**
     * @param {lang.Condition} token
     */
    generateCondition(token) {
        this.push('if (');

        if (token.condition[0] instanceof lang.Construct ||
            token.condition[0] instanceof lang.Variable) {
            this.assemble([
                new lang.Invoke([ new lang.Lambda([], token.condition) ], [])
            ]);
        } else {
            this.assembleAll(token.condition, ', ');
        }

        this.push(') {\n');

        if (token.last && token.consequent.length) {
            token.consequent[token.consequent.length - 1].last = true;
        }

        this.assembleAll(token.consequent, ';\n');

        if (token.last && token.alternative.length) {
            token.alternative[token.alternative.length - 1].last = true;
        }

        if (token.alternative.length) {
            this.push('} else {\n');
            this.assembleAll(token.alternative, ';\n');
        } else if (token.last) {
            this.push('} else {\nreturn null;\n');
        }

        this.push('}');
    }

    /**
     * @param {lang.Comparison} token
     */
    generateComparison(token) {
        token.last && this.push('return ');
        this.push('(');
        this.assemble(token.left);
        this.push(token.type[0].name);
        this.assemble(token.right);
        this.push(')');
    }

    /**
     * @param {lang.While} token
     */
    generateWhile(token) {
        this.push('while (');
        this.assembleAll(token.condition, ', ');
        this.push(') {\n');

        if (token.last && token.body.length) {
            token.body[token.body.length - 1].last = true;
        }

        this.assembleAll(token.body, ';\n');
        this.push('}');
    }

    /**
     * @param {lang.WhileTrue} token
     */
    generateWhileTrue(token) {
        this.push('while (true) {\n');

        if (token.last && token.body.length) {
            token.body[token.body.length - 1].last = true
        }

        this.assembleAll(token.body, ';\n');
        this.push('break;\n');
        this.push('}');
    }

    /**
     * @param {lang.Continue} token
     */
    generateContinue() {
        this.push('continue;');
    }

    /**
     * @param {lang.Scope} token
     */
    generateScope(token) {
        if (token.last && token.body.length) {
            token.body[token.body.length - 1].last = true;
        }

        this.state.createScope();
        this.assembleAll(token.body, ';\n');
        this.state.destroyScope();
    }

    /**
     * @param {lang.IndexedSymbol} token
     */
    generateIndexedSymbol(token) {
        token.last && this.push('return ');
        this.push(this.state.scopes[0][token.index])
    }

    /**
     * @param {lang.Math} token
     */
    generateMathOperator(token) {
        token.last && this.push('return ');
        this.assemble(token.left);
        this.push(token.operator[0].name);
        this.assemble(token.right);
    }

    /**
     * @param {lang.Array} token
     */
    generateArray(token) {
        token.last && this.push('return ');
        this.push('[ ');
        this.assembleAll(token.vals, ', ');
        this.push(' ]');
    }
}

function createAssembler() {
    return new Assembler();
}

module.exports = createAssembler;