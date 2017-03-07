import test from 'ava';
import CljsParser from './parser';
import { createNode, createLeaf, createToken } from './scope';

 // TODO: update test according new grammar
const parser = new CljsParser();

test('should return an object', (assert) => {
    assert.is(typeof parser.parse('()'), 'object');
});

test('should parse list', (assert) => {
    const ast = parser.parse(`
        (ns cljs-parser.test)
    `);

    assert.deepEqual(ast,
        createNode('list',
            createNode('s_exp_list',
                createLeaf('symbol', 'ns'),
                createNode('s_exp_list',
                    createLeaf('symbol', 'cljs-parser.test')
                )
            )
        )
    );
});

test('should parse multiple lists', (assert) => {
    const ast = parser.parse(`
        (+ 1 2)
        (* 3 4)
        (/ 10 5)
    `);

    assert.deepEqual(ast,
        createNode('list_list',
            createNode('list_list',
                createNode('list',
                    createNode('s_exp_list',
                        createLeaf('symbol', '+'),
                        createNode('s_exp_list',
                            createLeaf('number', 1),
                            createNode('s_exp_list',
                                createLeaf('number', 2)
                            )
                        )
                    )
                ),
                createNode('list',
                    createNode('s_exp_list',
                        createLeaf('symbol', '*'),
                        createNode('s_exp_list',
                            createLeaf('number', 3),
                            createNode('s_exp_list',
                                createLeaf('number', 4)
                            )
                        )
                    )
                ),
            ),
            createNode('list',
                createNode('s_exp_list',
                    createLeaf('symbol', '/'),
                    createNode('s_exp_list',
                        createLeaf('number', 10),
                        createNode('s_exp_list',
                            createLeaf('number', 5)
                        )
                    )
                )
            )
        )
    );
});

test('should parse booleans', (assert) => {
    const ast = parser.parse(`
        (if true then false)
    `);

    assert.deepEqual(ast,
        createNode('list',
            createNode('s_exp_list',
                createLeaf('symbol', 'if'),
                createNode('s_exp_list',
                    createLeaf('boolean', true),
                    createNode('s_exp_list',
                        createLeaf('symbol', 'then'),
                        createNode('s_exp_list',
                            createLeaf('boolean', false)
                        )
                    )
                )
            )
        )
    );
});

test('should parse vectors and numbers', (assert) => {
    const ast = parser.parse(`
        (map inc [1 2 3])
    `);

    assert.deepEqual(ast,
        createNode('list',
            createNode('s_exp_list',
                createLeaf('symbol', 'map'),
                createNode('s_exp_list',
                    createLeaf('symbol', 'inc'),
                    createNode('s_exp_list',
                        createNode('vector',
                            createNode('s_exp_list',
                                createLeaf('number', 1),
                                createNode('s_exp_list',
                                    createLeaf('number', 2),
                                    createNode('s_exp_list',
                                        createLeaf('number', 3)
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    )
});

test('should parse string', (assert) => {
    const ast = parser.parse(`
        (.log console "true")  
    `);

    assert.deepEqual(ast,
        createNode('list',
            createNode('s_exp_list',
                createLeaf('symbol', '.log'),
                createNode('s_exp_list',
                    createLeaf('symbol', 'console'),
                    createNode('s_exp_list',
                        createLeaf('string', 'true')
                    )
                )
            )
        )
    );
});

test.todo('should parse anonymous functions');
test.todo('should parse maps');
test.todo('should parse sets');