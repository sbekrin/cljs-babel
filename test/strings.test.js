import test from 'ava';
import compiler from './helpers/macro';

test(
    'should compile str without values',
    compiler,
    '(str)',
    '[].join("");'
);

test(
    'should compile str with nil value',
    compiler,
    '(str nil)',
    '[null].join("");'
);

test(
    'should compile str with values',
    compiler,
    '(str "foo" bar "baz")',
    '["foo", bar, "baz"].join("");'
);