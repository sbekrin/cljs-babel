import test from 'ava';
import * as t from 'cljs-types';
import parser from './helpers/macro';
import parse from '../lib';

test('should parse code and return an object', (assert) => {
    assert.notThrows(() => parse('()'));
    assert.true('sourceCode' in parse('()'));
    assert.true('cljsAst' in parse('()'));
});

test(
    'should parse form',
    parser,  
    '(ns cljs-parser.test)',
    t.createProgram(
        t.createForm(
            [
                t.createSymbol('ns', [ 1, 1, 1, 3 ]),
                t.createSymbol('cljs-parser.test', [ 1, 4, 1, 20 ])
            ],
            [ 1, 0, 1, 21 ]
        ),
        [ 1, 0, 1, 21 ]
    )
);

test(
    'should parse multiple forms',
    parser,
    `
        (+ 1 2)
        (* 3 4)
        (/ 10 5)
    `,
    t.createProgram(
        t.createLeaf(
            t.createLeaf(
                t.createForm(
                    [
                        t.createSymbol('+', [ 2, 9, 2, 10 ]),
                        t.createNumber(1, [ 2, 11, 2, 12 ]),
                        t.createNumber(2, [ 2, 13, 2, 14 ])
                    ],
                    [ 2, 8, 2, 15 ]
                ),
                t.createForm(
                    [
                        t.createSymbol('*', [ 3, 9, 3, 10 ]),
                        t.createNumber(3, [ 3, 11, 3, 12 ]),
                        t.createNumber(4, [ 3, 13, 3, 14 ])
                    ],
                    [ 3, 8, 3, 15 ]
                ),
                [ 2, 8, 3, 15 ]
            ),
            t.createForm(
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

test(
    'should parse string',
    parser,
    `
        (.log console "foo bar")
    `,
    t.createProgram(
        t.createForm(
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

test(
    'should parse boolean',
    parser,
    `
        (if true then false)
    `,
    t.createProgram(
        t.createForm(
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

test(
    'should parse vector and number',
    parser,
    `
        (map inc [1 2 3])
    `,
    t.createProgram(
        t.createForm(
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

test(
    'should parse map and keyword',
    parser,
    `
        (def foo {:bar 42})
    `,
    t.createProgram(
        t.createForm(
            [
                t.createSymbol('def', [ 2, 9, 2, 12 ]),
                t.createSymbol('foo', [ 2, 13, 2, 16 ]),
                t.createMap(
                    [
                        t.createKeyword(':bar', [ 2, 18, 2, 22 ]),
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

test(
    'should parse meta with symbol',
    parser,
    '(def ^number foo 42)',
    t.createProgram(
        t.createForm(
            [
                t.createSymbol('def', [ 1, 1, 1, 4 ]),
                t.createSymbol(
                    'foo',
                    [
                        t.createMeta(
                            t.createSymbol('number', [ 1, 6, 1, 12 ]),
                            [ 1, 5, 1, 12 ]
                        )
                    ],
                    [ 1, 5, 1, 16 ]
                ),
                t.createNumber(42, [ 1, 17, 1, 19 ])
            ],
            [ 1, 0, 1, 20 ]
        ),
        [ 1, 0, 1, 20 ]
    )
);

test(
    'should parse meta with keyword',
    parser,
    '(def ^:export foo 42)',
    t.createProgram(
        t.createForm(
            [
                t.createSymbol('def', [ 1, 1, 1, 4 ]),
                t.createSymbol(
                    'foo',
                    [
                        t.createMeta(
                            t.createKeyword(':export', [ 1, 6, 1, 13 ]),
                            [ 1, 5, 1, 13 ]
                        )
                    ],
                    [ 1, 5, 1, 17 ]
                ),
                t.createNumber(42, [ 1, 18, 1, 20 ])
            ],
            [ 1, 0, 1, 21 ]
        ),
        [ 1, 0, 1, 21 ]
    )
);

test(
    'should parse meta with map',
    parser,
    '(def ^{:foo "bar"} baz 42)',
    t.createProgram(
        t.createForm(
            [
                t.createSymbol('def', [ 1, 1, 1, 4 ]),
                t.createSymbol(
                    'baz',
                    [
                        t.createMeta(
                            t.createMap(
                                [
                                    t.createKeyword(':foo', [ 1, 7, 1, 11 ]),
                                    t.createString('bar', [ 1, 12, 1, 17 ])
                                ],
                                [ 1, 6, 1, 18 ]
                            ),
                            [ 1, 5, 1, 18 ]
                        )
                    ],
                    [ 1, 5, 1, 22 ]
                ),
                t.createNumber(42, [ 1, 23, 1, 25 ])
            ],
            [ 1, 0, 1, 26 ]
        ),
        [ 1, 0, 1, 26 ]
    )
);

test(
    'should parse multiple metas for same symbol',
    parser,
    '(def ^:foo ^:bar foo 42)',
    t.createProgram(
        t.createForm(
            [
                t.createSymbol('def', [ 1, 1, 1, 4 ]),
                t.createSymbol(
                    'foo',
                    [
                        t.createMeta(
                            t.createKeyword(':foo', [ 1, 6, 1, 10 ]),
                            [ 1, 5, 1, 10 ]
                        ),
                        t.createMeta(
                            t.createKeyword(':bar', [ 1, 12, 1, 16 ]),
                            [ 1, 11, 1, 16 ]
                        )
                    ],
                    [ 1, 5, 1, 20 ]
                ),
                t.createNumber(42, [ 1, 21, 1, 23 ])
            ],
            [ 1, 0, 1, 24 ]
        ),
        [ 1, 0, 1, 24 ]
    )
);

test.todo('should parse sets');
test.todo('should parse anonymous functions');