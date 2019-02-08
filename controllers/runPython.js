"use strict";
var spawn = require("child_process").spawn;
var runPython = {};

runPython.test = function (req, res) {
    var process = spawn('python',["./python/hello.py"]);
    process.stdout.on('data', function(data) {
          console.log("hello ...");
          res.send(data.toString());
    })
},

runPython.getTrendingProducts = function (req, res) {
  console.log("runPython: getTrendingProducts");
    var process = spawn('python',["./python/trending_products.py"]);
    process.stdout.on('data', function(data) {
          console.log("runPython: trending_products");
          res.send(data);
    })
},

runPython.getRecommendedProducts = function (req, res) {
  console.log("runPython: getRecommendedProducts");
    var process = spawn('python',["./python/recommendation.py"]);
    process.stdout.on('data', function(data) {
          console.log("runPython: recommendation");
          res.send(data);
    })
},

runPython.getCartRecommendedProducts = function (req, res) {
  console.log("runPython: getCartRecommendedProducts");
    var process = spawn('python',["./python/cart_recommendation.py"]);
    process.stdout.on('data', function(data) {
          console.log("runPython: cart_recommendation");
          res.send(data);
    })
}

module.exports = runPython;
