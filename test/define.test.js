import test from 'ava';
import { stripIndent } from 'common-tags';
import compiler from './helpers/macro';

test(
    'should compile def to variable assignment',
    compiler,
    '(def foo 42)',
    'var foo = 42;'
);

test(
    'should compile def to null assignment with empty value',
    compiler,
    '(def bar)',
    'var bar = null;'
);

test(
    'should compile def with doc string',
    compiler,
    '(def foo "bar" 42)',
    'var foo = 42;'
);