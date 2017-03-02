(def express (require "express"))

(def app (express))

(.get app "/"
  (fn [_ res]
    (.send res "Hello world!")))

(.get app "/:someId"
  (fn [req res]
    (.send res (str "You provided " (.-params.someId req) " as id"))))

(.listen app 3333)