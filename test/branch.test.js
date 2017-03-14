import test from 'ava';
import { stripIndent } from 'common-tags';
import compiler from './helpers/macro';

test(
    'should compile basic if',
    compiler,
    '(if true (print "foo"))',
    stripIndent`
    if (true) {
      print("foo");
    }`
);

test(
    'should compile if with else expression',
    compiler,
    '(if false (print "foo") (print "bar"))',
    stripIndent`
    if (false) {
      print("foo");
    } else {
      print("bar");
    }`
)