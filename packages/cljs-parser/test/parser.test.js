import test from 'ava';
import * as t from 'cljs-types';
import parse from 'cljs-parser';

test('should parse code and return an object', (assert) => {
    assert.notThrows(() => parse('()'));
    assert.true('sourceCode' in parse('()'));
    assert.true('cljsAst' in parse('()'));
});

test('should parse list', (assert) => {
    const output = parse(`
        (ns cljs-parser.test)
    `);

    assert.deepEqual(output.cljsAst,
        t.createProgram(
            t.createList(
                [
                    t.createSymbol('ns', [ 2, 9, 2, 11 ]),
                    t.createSymbol('cljs-parser.test', [ 2, 12, 2, 28 ])
                ],
                [ 2, 8, 2, 29 ]
            ),
            [ 2, 8, 3, 4 ]
        )
    );
});

test('should parse multiple lists', (assert) => {
    const output = parse(`
        (+ 1 2)
        (* 3 4)
        (/ 10 5)
    `);

    assert.deepEqual(output.cljsAst,
        t.createProgram(
            t.createLeaf(
                t.createLeaf(
                    t.createList(
                        [
                            t.createSymbol('+', [ 2, 9, 2, 10 ]),
                            t.createNumber(1, [ 2, 11, 2, 12 ]),
                            t.createNumber(2, [ 2, 13, 2, 14 ])
                        ],
                        [ 2, 8, 2, 15 ]
                    ),
                    t.createList(
                        [
                            t.createSymbol('*', [ 3, 9, 3, 10 ]),
                            t.createNumber(3, [ 3, 11, 3, 12 ]),
                            t.createNumber(4, [ 3, 13, 3, 14 ])
                        ],
                        [ 3, 8, 3, 15 ]
                    ),
                    [ 2, 8, 3, 15 ]
                ),
                t.createList(
                    [
                        t.createSymbol('/', [ 4, 9, 4, 10 ]),
                        t.createNumber(10, [ 4, 11, 4, 13 ]),
                        t.createNumber(5, [ 4, 14, 4, 15 ])
                    ],
                    [ 4, 8, 4, 16 ]
                ),
                [ 2, 8, 4, 16 ]
            ),
            [ 2, 8, 5, 4 ]
        )
    );
});

test('should parse string', (assert) => {
    const output = parse(`
        (.log console "foo bar")  
    `);

    assert.deepEqual(output.cljsAst,
        t.createProgram(
            t.createList(
                [
                    t.createSymbol('.log', [ 2, 9, 2, 13 ]),
                    t.createSymbol('console', [ 2, 14, 2, 21 ]),
                    t.createString('foo bar', [ 2, 22, 2, 31 ])
                ],
                [ 2, 8, 2, 32 ]
            ),
            [ 2, 8, 3, 4 ]
        )
    );
});

test('should parse boolean', (assert) => {
    const output = parse(`
        (if true then false)
    `);

    assert.deepEqual(output.cljsAst,
        t.createProgram(
            t.createList(
                [
                    t.createSymbol('if', [ 2, 9, 2, 11 ]),
                    t.createBoolean(true, [ 2, 12, 2, 16 ]),
                    t.createSymbol('then', [ 2, 17, 2, 21 ]),
                    t.createBoolean(false, [ 2, 22, 2, 27 ])
                ],
                [ 2, 8, 2, 28 ]
            ),
            [ 2, 8, 3, 4 ]
        )
    );
});

test('should parse vector and number', (assert) => {
    const output = parse(`
        (map inc [1 2 3])
    `);

    assert.deepEqual(output.cljsAst,
        t.createProgram(
            t.createList(
                [
                    t.createSymbol('map', [ 2, 9, 2, 12 ]),
                    t.createSymbol('inc', [ 2, 13, 2, 16 ]),
                    t.createVector(
                        [
                            t.createNumber(1, [ 2, 18, 2, 19 ]),
                            t.createNumber(2, [ 2, 20, 2, 21 ]),
                            t.createNumber(3, [ 2, 22, 2, 23 ])
                        ],
                        [ 2, 17, 2, 24 ]
                    )
                ],
                [ 2, 8, 2, 25 ]
            ),
            [ 2, 8, 3, 4 ]
        )
    );
});

test('should parse map and keyword', (assert) => {
    const output = parse(`
        (def foo {:bar 42})
    `);

    assert.deepEqual(output.cljsAst,
        t.createProgram(
            t.createList(
                [
                    t.createSymbol('def', [ 2, 9, 2, 12 ]),
                    t.createSymbol('foo', [ 2, 13, 2, 16 ]),
                    t.createMap(
                        [
                            t.createKeyword('bar', [ 2, 18, 2, 22 ]),
                            t.createNumber(42, [ 2, 23, 2, 25 ])
                        ],
                        [ 2, 17, 2, 26 ]
                    )
                ],
                [ 2, 8, 2, 27 ]
            ),
            [ 2, 8, 3, 4 ]
        )
    );
});

test.todo('should parse sets');
test.todo('should parse anonymous functions');
