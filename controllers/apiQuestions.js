"use strict";

var db_pool = require('./../helpers/db');
var apiQuestions = {};

apiQuestions.submitAnswers = function (req, res) {
  res.status(200).send({"Hello 123"}});
}
module.exports = apiQuestions;
