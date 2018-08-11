(ns babel-register.test
  (:require [express]))

(def app (express))

(.get app "/"
      (fn [req res]
        (.send res "Hello World!")))

(.listen app 3000
         (fn []
           (.log console "Example app listening on port 3000")))
