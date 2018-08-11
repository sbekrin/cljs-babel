const { transform } = require('@cljs/test-utils');

describe('functions', () => {
  it('compiles arithmetic operations', () => {
    expect(transform('(+ 1 2 3 4)')).toMatchInlineSnapshot(
      `"(1 + 2 + 3 + 4);"`
    );
    expect(transform('(- 1 2 3 4)')).toMatchInlineSnapshot(
      `"(1 - 2 - 3 - 4);"`
    );
    expect(transform('(/ 1 2 3 4)')).toMatchInlineSnapshot(
      `"(1 / 2 / 3 / 4);"`
    );
    expect(transform('(* 1 2 3 4)')).toMatchInlineSnapshot(
      `"(1 * 2 * 3 * 4);"`
    );
  });

  it('compiles nested arithmetic operations', () => {
    expect(transform('(+ (* 1 2) (- 3 4))')).toMatchInlineSnapshot(
      `"((1 * 2) + (3 - 4));"`
    );
  });
});
