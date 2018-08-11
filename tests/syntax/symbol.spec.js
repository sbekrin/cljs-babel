const { transform } = require('@cljs/test-utils');

describe('syntax', () => {
  describe('symbols', () => {
    it('supports dot resolution', () => {
      expect(transform('(.foo bar)')).toMatchInlineSnapshot(`"bar.foo();"`);
      expect(transform('(.-foo bar)')).toMatchInlineSnapshot(`"bar.foo;"`);
      expect(transform('(foo. bar)')).toMatchInlineSnapshot(`"new foo(bar);"`);
      expect(transform('(console.log foo.bar.baz)')).toMatchInlineSnapshot(
        `"console.log(foo.bar.baz);"`
      );
      expect(transform('(foo.bar.baz)')).toMatchInlineSnapshot(
        `"foo.bar.baz();"`
      );
    });
  });
});
