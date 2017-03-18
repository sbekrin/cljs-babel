<img src="https://github.com/sergeybekrin/cljs-compiler/raw/master/.github/logo.png" alt="logo" width="240" height="240" />
# ClojureScript to JavaScript compiler
Experemental compiler which aims to generate ES5 JavaScript from
ClojureScript source code.

## Q&A
### Why not existing Java compiler?
This compiler is designed for modern JavaScript ecosystem, it's not compatiable
with existing Java version. Generated code targets CommonJS module system and
does't depend on [Google Closure Library](https://developers.google.com/closure/library/),
so it can be used in Node directly.

### Does it support exiting APIs?
This compiler generates js-first code, that means you wont't need namespaces
for APIs, code like `(parseInt "42")`, `(.setTimeout window #(alert "Hello!") 1000)`
and `(Promise. (fn [resolve] (resolve 42)))` will work out-of-box.

## References
* @alanshaw's [cljs-compiler](https://github.com/alanshaw/cljs-compiler)
* @daynin's [tiny-lisp](https://github.com/daynin/tiny-lisp)
* [Babel](https://github.com/babel/babel)

## License
[MIT](https://github.com/sergeykrinbe/cljs-compiler/blob/master/LICENSE)