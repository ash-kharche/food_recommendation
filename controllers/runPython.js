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

runPython.getTrendingProducts = function (callback) {
  console.log("runPython: getTrendingProducts");
    var process = spawn('python',["./python/trending_products.py"]);
    process.stdout.on('data', function(data) {
          if(data) {
              console.log("runPython: trending_products");
              callback(null, data);
          }
    })
},

runPython.getRecommendedProducts = function (callback) {
  console.log("runPython: getRecommendedProducts");
    var process = spawn('python',["./python/recommendation.py"]);
    process.stdout.on('data', function(data) {
          if(data) {
              console.log("runPython: recommendation");
              callback(null, data);
          }
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
