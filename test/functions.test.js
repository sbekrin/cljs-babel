import test from 'ava';
import { stripIndent } from 'common-tags';
import compiler from './helpers/macro';

test(
    'should compile fn to anonymous function',
    compiler,
    '(fn [x] (* x x))',
    stripIndent`
    (function (x) {
      return (x * x);
    });`
);