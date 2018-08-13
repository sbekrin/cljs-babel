const { transform } = require('@cljs/test-utils');

describe('syntax', () => {
  describe('symbols', () => {
    it('supports dot resolution', () => {
      expect(transform('(.foo bar)')).toMatchInlineSnapshot(`"bar.foo();"`);
      expect(transform('(.-foo bar)')).toMatchInlineSnapshot(`"bar.foo;"`);
      expect(transform('(foo. bar)')).toMatchInlineSnapshot(`"new foo(bar);"`);
      expect(transform('foo.bar.baz')).toMatchInlineSnapshot(`"foo.bar.baz;"`);
      expect(transform('(foo.bar.baz)')).toMatchInlineSnapshot(
        `"foo.bar.baz();"`
      );
    });

    it('supports vectors', () => {
      expect(transform('[1 2 3 4]')).toMatchInlineSnapshot(`"[1, 2, 3, 4];"`);
    });

    it('supports lists', () => {
      expect(transform('(foo bar)')).toMatchInlineSnapshot(`"foo(bar);"`);
    });

    it('supports maps', () => {
      expect(transform('{:foo 1 :bar 2}')).toMatchInlineSnapshot(
        `"new Map([[\\":foo\\", 1], [\\":bar\\", 2]]);"`
      );
    });

    it('supports sets', () => {
      expect(transform('#{1 2 3}')).toMatchInlineSnapshot(
        `"new Set([1, 2, 3]);"`
      );
    });
  });
});
