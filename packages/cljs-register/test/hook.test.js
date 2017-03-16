import test from 'ava';
import hook from './hook/bar';

test((assert) => {
    assert.is(hook(), 100);
});