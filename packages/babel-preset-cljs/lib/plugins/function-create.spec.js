const { transform } = require('@cljs/test-utils');

describe('functions', () => {
  it('should compile fn to anonymous function', () => {
    expect(transform('(fn [x] (* x x))')).toMatchInlineSnapshot(`
"(function (x) {
  return (x * x);
});"
`);
  });
});
