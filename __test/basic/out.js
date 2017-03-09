var express = require.call(null, "express");

var app = express.call(null);
app.get("/", function (_, res) {
  res.send("Hello world!");
});
app.get("/:someId", function (req, res) {
  res.send(["You provided ", req.paramssomeId, " as id"].join(""));
});
app.listen(3333);