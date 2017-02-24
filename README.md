# Clojure to JavaScript compiler
## About
This is experemental compiler which aims to generate ES5 JavaScript from
ClojureScript source code.

> This project based on great work of @alanshaw's and his version
> of [cljs-parser](https://github.com/alanshaw/cljs-parser).

## FAQ
### Why not existing Java compiler?
This compiler is designed for modern JavaScript ecosystem, it's not compatiable
with existing Java version. Generated code targets CommonJS module system and
does't depend on [Google Closure Library](https://developers.google.com/closure/library/)
and can be used in Node directly.

### Does it support exiting APIs?
This compiler generates js-first code, that means you wont't need namespaces
for APIs, stuff like `(parseInt "42")`, `(.setTimeout window #(alert "Hello!") 1000)`
and `(new Promise (fn [resolve] (resolve 42)))` will work out-of-box. 
