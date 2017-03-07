;; Import express
(def express (require "express"))

;; Create new app instance
(def app (express))

;; Map root route
(.get app "/"
  (fn [_ res]
    (.send res "Hello world!")))

;; Map dynamic route
(.get app "/:someId"
  (fn [req res]
    (.send res (str "You provided " (.-params.someId req) " as id"))))

;; Start app
(.listen app 3333)