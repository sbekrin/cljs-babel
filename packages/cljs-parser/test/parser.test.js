const t = require('@cljs/types');
const { parse } = require('@cljs/parser');

describe('Parser', () => {
  it('parses form', () => {
    expect(parse('(ns cljs-parser.test)')).toMatchInlineSnapshot(`
ProgramNode {
  "last": false,
  "location": Object {
    "endColumn": 21,
    "endLine": 1,
    "startColumn": 0,
    "startLine": 1,
  },
  "program": ListNode {
    "last": false,
    "location": Object {
      "endColumn": 21,
      "endLine": 1,
      "startColumn": 0,
      "startLine": 1,
    },
    "meta": null,
    "values": Array [
      SymbolNode {
        "last": false,
        "location": Object {
          "endColumn": 3,
          "endLine": 1,
          "startColumn": 1,
          "startLine": 1,
        },
        "meta": null,
        "value": "ns",
      },
      SymbolNode {
        "last": true,
        "location": Object {
          "endColumn": 20,
          "endLine": 1,
          "startColumn": 4,
          "startLine": 1,
        },
        "meta": null,
        "value": "cljs-parser.test",
      },
    ],
  },
}
`);
  });

  it('parses multiple forms', () => {
    expect(parse('(+ 1 2) (* 3 4) (/ 10 5)')).toMatchInlineSnapshot(`
ProgramNode {
  "last": false,
  "location": Object {
    "endColumn": 24,
    "endLine": 1,
    "startColumn": 0,
    "startLine": 1,
  },
  "program": LeafNode {
    "last": false,
    "left": LeafNode {
      "last": false,
      "left": ListNode {
        "last": false,
        "location": Object {
          "endColumn": 7,
          "endLine": 1,
          "startColumn": 0,
          "startLine": 1,
        },
        "meta": null,
        "values": Array [
          SymbolNode {
            "last": false,
            "location": Object {
              "endColumn": 2,
              "endLine": 1,
              "startColumn": 1,
              "startLine": 1,
            },
            "meta": null,
            "value": "+",
          },
          NumberNode {
            "last": false,
            "location": Object {
              "endColumn": 4,
              "endLine": 1,
              "startColumn": 3,
              "startLine": 1,
            },
            "value": 1,
          },
          NumberNode {
            "last": true,
            "location": Object {
              "endColumn": 6,
              "endLine": 1,
              "startColumn": 5,
              "startLine": 1,
            },
            "value": 2,
          },
        ],
      },
      "location": Object {
        "endColumn": 15,
        "endLine": 1,
        "startColumn": 0,
        "startLine": 1,
      },
      "right": ListNode {
        "last": false,
        "location": Object {
          "endColumn": 15,
          "endLine": 1,
          "startColumn": 8,
          "startLine": 1,
        },
        "meta": null,
        "values": Array [
          SymbolNode {
            "last": false,
            "location": Object {
              "endColumn": 10,
              "endLine": 1,
              "startColumn": 9,
              "startLine": 1,
            },
            "meta": null,
            "value": "*",
          },
          NumberNode {
            "last": false,
            "location": Object {
              "endColumn": 12,
              "endLine": 1,
              "startColumn": 11,
              "startLine": 1,
            },
            "value": 3,
          },
          NumberNode {
            "last": true,
            "location": Object {
              "endColumn": 14,
              "endLine": 1,
              "startColumn": 13,
              "startLine": 1,
            },
            "value": 4,
          },
        ],
      },
    },
    "location": Object {
      "endColumn": 24,
      "endLine": 1,
      "startColumn": 0,
      "startLine": 1,
    },
    "right": ListNode {
      "last": false,
      "location": Object {
        "endColumn": 24,
        "endLine": 1,
        "startColumn": 16,
        "startLine": 1,
      },
      "meta": null,
      "values": Array [
        SymbolNode {
          "last": false,
          "location": Object {
            "endColumn": 18,
            "endLine": 1,
            "startColumn": 17,
            "startLine": 1,
          },
          "meta": null,
          "value": "/",
        },
        NumberNode {
          "last": false,
          "location": Object {
            "endColumn": 21,
            "endLine": 1,
            "startColumn": 19,
            "startLine": 1,
          },
          "value": 10,
        },
        NumberNode {
          "last": true,
          "location": Object {
            "endColumn": 23,
            "endLine": 1,
            "startColumn": 22,
            "startLine": 1,
          },
          "value": 5,
        },
      ],
    },
  },
}
`);
  });

  it('parses string', () => {
    expect(parse('(.log console "foo bar")')).toMatchInlineSnapshot(`
ProgramNode {
  "last": false,
  "location": Object {
    "endColumn": 24,
    "endLine": 1,
    "startColumn": 0,
    "startLine": 1,
  },
  "program": ListNode {
    "last": false,
    "location": Object {
      "endColumn": 24,
      "endLine": 1,
      "startColumn": 0,
      "startLine": 1,
    },
    "meta": null,
    "values": Array [
      SymbolNode {
        "last": false,
        "location": Object {
          "endColumn": 5,
          "endLine": 1,
          "startColumn": 1,
          "startLine": 1,
        },
        "meta": null,
        "value": ".log",
      },
      SymbolNode {
        "last": false,
        "location": Object {
          "endColumn": 13,
          "endLine": 1,
          "startColumn": 6,
          "startLine": 1,
        },
        "meta": null,
        "value": "console",
      },
      StringNode {
        "last": true,
        "location": Object {
          "endColumn": 23,
          "endLine": 1,
          "startColumn": 14,
          "startLine": 1,
        },
        "value": "foo bar",
      },
    ],
  },
}
`);
  });
});

/*
test(
  'should parse boolean',
  parser,
  `
        (if true then false)
    `,
  t.createProgram(
    t.createForm(
      [
        t.createSymbol('if', [2, 9, 2, 11]),
        t.createBoolean(true, [2, 12, 2, 16]),
        t.createSymbol('then', [2, 17, 2, 21]),
        t.createBoolean(false, [2, 22, 2, 27]),
      ],
      [2, 8, 2, 28]
    ),
    [2, 8, 3, 4]
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
        t.createSymbol('map', [2, 9, 2, 12]),
        t.createSymbol('inc', [2, 13, 2, 16]),
        t.createVector(
          [
            t.createNumber(1, [2, 18, 2, 19]),
            t.createNumber(2, [2, 20, 2, 21]),
            t.createNumber(3, [2, 22, 2, 23]),
          ],
          [2, 17, 2, 24]
        ),
      ],
      [2, 8, 2, 25]
    ),
    [2, 8, 3, 4]
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
        t.createSymbol('def', [2, 9, 2, 12]),
        t.createSymbol('foo', [2, 13, 2, 16]),
        t.createMap(
          [
            t.createKeyword(':bar', [2, 18, 2, 22]),
            t.createNumber(42, [2, 23, 2, 25]),
          ],
          [2, 17, 2, 26]
        ),
      ],
      [2, 8, 2, 27]
    ),
    [2, 8, 3, 4]
  )
);

test(
  'should parse meta with symbol',
  parser,
  '(def ^number foo 42)',
  t.createProgram(
    t.createForm(
      [
        t.createSymbol('def', [1, 1, 1, 4]),
        t.createSymbol(
          'foo',
          [
            t.createMeta(t.createSymbol('number', [1, 6, 1, 12]), [
              1,
              5,
              1,
              12,
            ]),
          ],
          [1, 5, 1, 16]
        ),
        t.createNumber(42, [1, 17, 1, 19]),
      ],
      [1, 0, 1, 20]
    ),
    [1, 0, 1, 20]
  )
);

test(
  'should parse meta with keyword',
  parser,
  '(def ^:export foo 42)',
  t.createProgram(
    t.createForm(
      [
        t.createSymbol('def', [1, 1, 1, 4]),
        t.createSymbol(
          'foo',
          [
            t.createMeta(t.createKeyword(':export', [1, 6, 1, 13]), [
              1,
              5,
              1,
              13,
            ]),
          ],
          [1, 5, 1, 17]
        ),
        t.createNumber(42, [1, 18, 1, 20]),
      ],
      [1, 0, 1, 21]
    ),
    [1, 0, 1, 21]
  )
);

test(
  'should parse meta with map',
  parser,
  '(def ^{:foo "bar"} baz 42)',
  t.createProgram(
    t.createForm(
      [
        t.createSymbol('def', [1, 1, 1, 4]),
        t.createSymbol(
          'baz',
          [
            t.createMeta(
              t.createMap(
                [
                  t.createKeyword(':foo', [1, 7, 1, 11]),
                  t.createString('bar', [1, 12, 1, 17]),
                ],
                [1, 6, 1, 18]
              ),
              [1, 5, 1, 18]
            ),
          ],
          [1, 5, 1, 22]
        ),
        t.createNumber(42, [1, 23, 1, 25]),
      ],
      [1, 0, 1, 26]
    ),
    [1, 0, 1, 26]
  )
);

test(
  'should parse multiple metas for same symbol',
  parser,
  '(def ^:foo ^:bar foo 42)',
  t.createProgram(
    t.createForm(
      [
        t.createSymbol('def', [1, 1, 1, 4]),
        t.createSymbol(
          'foo',
          [
            t.createMeta(t.createKeyword(':foo', [1, 6, 1, 10]), [1, 5, 1, 10]),
            t.createMeta(t.createKeyword(':bar', [1, 12, 1, 16]), [
              1,
              11,
              1,
              16,
            ]),
          ],
          [1, 5, 1, 20]
        ),
        t.createNumber(42, [1, 21, 1, 23]),
      ],
      [1, 0, 1, 24]
    ),
    [1, 0, 1, 24]
  )
);

test.todo('should parse sets');
test.todo('should parse anonymous functions');
*/
