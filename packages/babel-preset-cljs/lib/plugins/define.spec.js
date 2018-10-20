const { transform } = require('@cljs/test-utils');

describe('define', () => {
  it('translates def to variable assignment', () => {
    expect(transform('(def foo 42)')).toMatchInlineSnapshot(`"var foo = 42;"`);
  });

  it('translates def without a value to null assignment', () => {
    expect(transform('(def bar)')).toMatchInlineSnapshot(`"var bar = null;"`);
  });

  it('translates def with doc string', () => {
    expect(transform('(def foo "bar" 42)')).toMatchInlineSnapshot(
      `"/** bar */var foo = 42;"`
    );
  });
});
