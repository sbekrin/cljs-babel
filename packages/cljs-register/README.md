# cljs-register
Hook node's require to compile ClojureScript modules on the fly.

## Usage
```clj
;; foo.cljs
(defn ^:export square [x] (* x x))
```

```js
// bar.js
require('cljs-register');

const square = require('./foo.cljs');
square(2); // -> 4
```