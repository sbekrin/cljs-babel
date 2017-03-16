import test from 'ava';
import { stripIndent } from 'common-tags';
import compiler from './helpers/macro';

test(
    'should compile basic arithmetic operations',
    compiler,
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
);

test(
    'should compile nested arithmetic operations',
    compiler,
    '(* (+ 1 2) (- 2 1))',
    '((1 + 2) * (2 - 1));'
);