const { transform } = require('@cljs/test-utils');

describe('syntax', () => {
  describe('collections', () => {
    it('supports vectors', () => {
      expect(transform('[1 2 3 4]')).toMatchInlineSnapshot(`"[1, 2, 3, 4];"`);
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
