import test from 'ava';
import { compile } from './index';
import { stripIndent } from 'common-tags';

const assertions = {
    'should compile def to variable assignment': [
        '(def foo 42)',
        'var foo = 42;'
    ],
    'should compile fn to anonymous function': [
        '(fn [x] (* x x))',
        stripIndent`
        (function (x) {
          return (x * x);
        });`
    ],
    'should compile basic arithmetic operations': [
        `(+ 1 2)
        (- 3 4)
        (* 5 6)
        (/ 7 8)`,
        stripIndent`
        (1 + 2);
        (3 - 4);
        (5 * 6);
        (7 / 8);
        `
    ],
    'should compile nested arithmetic operations': [
        `(* (+ 1 2) (- 2 1))`,
        stripIndent`
        ((1 + 2) * (2 - 1));
        `
    ]
};

Object.keys(assertions).forEach((assertion) => {
    test(assertion, (assert) => {
        const [ input, output ] = assertions[assertion];
        assert.is(compile(input).code, output);
    });
});