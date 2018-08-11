const { transform, evaluate } = require('@cljs/test-utils');

describe('functions', () => {
  it('compiles basic operations', () => {
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

  it('compiles quot', () => {
    expect(transform('(quot 20 10)')).toMatchInlineSnapshot(
      `"parseInt(Math.trunc(20 / 10));"`
    );
  });

  it('compiles rem', () => {
    expect(transform('(rem 10 20)')).toMatchInlineSnapshot(`"(10 % 20);"`);
    expect(evaluate('(rem -10 3)')).toBe(-1);
  });

  it('compiles mod', () => {
    expect(transform('(mod 10 20)')).toMatchInlineSnapshot(
      `"((10 % 20 + 20) % 20);"`
    );
    expect(evaluate('(mod -10 3)')).toBe(2);
  });

  it('compiles inc and dec', () => {
    expect(transform('(inc 41)')).toMatchInlineSnapshot(`"(41 + 1);"`);
    expect(transform('(dec 42)')).toMatchInlineSnapshot(`"(42 - 1);"`);
  });

  it('compiles max and min', () => {
    expect(transform('(max 1 2 3)')).toMatchInlineSnapshot(
      `"Math.max(1, 2, 3);"`
    );
    expect(transform('(min 3 2 1)')).toMatchInlineSnapshot(
      `"Math.min(3, 2, 1);"`
    );
  });
});
