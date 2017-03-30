# @cljs/register
Node package to hook *.cljs files and parse them on the fly.

## Usage
```clj
;; foo.cljs
(defn ^:export square [x] (* x x))
```

```js
// bar.js
require('@cljs/register');

const square = require('./foo.cljs');
square(2); // -> 4
```