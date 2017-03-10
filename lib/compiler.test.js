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
          return x * x;
        });`
    ]
};

Object.keys(assertions).forEach((assertion) => {
    test(assertion, (assert) => {
        const [ input, output ] = assertions[assertion];
        assert.is(compile(input).code, output);
    });
});