import test from 'ava';
import { stripIndent } from 'common-tags';
import compiler from './helpers/macro';

test(
    'should compile simple =',
    compiler,
    '(= foo bar)',
    'foo == bar;'
);

test(
    'should compile = with multiply values',
    compiler,
    '(= foo bar baz)',
    '(foo == bar) && (foo == baz);'
);

test(
    'shoul compiel if and simple = correctly',
    compiler,
    '(if (= foo bar) (print "foo"))',
    stripIndent`
    if (foo == bar) {
      print("foo");
    }`
)

test(
    'should compile if and complex = correctly',
    compiler,
    '(if (= foo bar baz) (print "foo") (print "bar"))',
    stripIndent`
    if ((foo == bar) && (foo == baz)) {
      print("foo");
    } else {
      print("bar");
    }`
);