var express = require("express");

var app = express();
app.get("/", function (_, res) {
  res.send("Hello world!");
});
app.get("/:someId", function (req, res) {
  res.send(["You provided ", req.params.someId, " as id"].join(""));
});
app.listen(3333);