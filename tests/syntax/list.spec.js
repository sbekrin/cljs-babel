const { transform } = require('@cljs/test-utils');

describe('syntax', () => {
  describe('list', () => {
    it('supports lists', () => {
      expect(transform('(foo bar)')).toMatchInlineSnapshot(`"foo(bar);"`);
    });

    it('supports dot resolution', () => {
      expect(transform('(.foo bar)')).toMatchInlineSnapshot(`"bar.foo();"`);
      expect(transform('(.-foo bar)')).toMatchInlineSnapshot(`"bar.foo;"`);
      expect(transform('(foo. bar)')).toMatchInlineSnapshot(`"new foo(bar);"`);
      expect(transform('foo.bar.baz')).toMatchInlineSnapshot(`"foo.bar.baz;"`);
      expect(transform('(foo.bar.baz)')).toMatchInlineSnapshot(
        `"foo.bar.baz();"`
      );
    });
  });
});
