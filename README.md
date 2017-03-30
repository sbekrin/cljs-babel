<img src="https://github.com/sergeybekrin/cljs/raw/master/.github/logo.png" alt="logo" width="240" height="240" />

# ClojureScript to JavaScript compiler
Experemental compiler which aims to generate ES5 JavaScript from
ClojureScript source code.

## Q&A
### Why not existing JVM compiler?
This compiler is designed for modern JavaScript ecosystem, it's not compatiable
with existing JVM version. Generated code targets CommonJS module system and
does't depend on [Google Closure Library](https://developers.google.com/closure/library/),
so it can be used in Node directly.

### Does it support exiting JS APIs?
This compiler generates js-first code, that means you wont't need namespaces
for APIs, code like `(parseInt "42")`, `(.setTimeout window #(alert "Hello!") 1000)`
and `(Promise. (fn [resolve] (resolve 42)))` will work out-of-box.

### What is status of this project?
This project is under active development. The primary target as for now is to achieve
spec-compliance with existing ClojureScript compiler.

## References
* [cljs-compiler](https://github.com/alanshaw/cljs-compiler)
* [tiny-lisp](https://github.com/daynin/tiny-lisp)
* [Babel](https://github.com/babel/babel)
* [ClojureScript API](http://cljs.github.io/api) 
* [ClojureScript Cheatsheet](http://cljs.info/cheatsheet)
* [AST Explorer](https://astexplorer.net)

## License
[MIT](https://github.com/sergeykrinbe/cljs-compiler/blob/master/LICENSE)