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
    var process = spawn('python',["./python/dummy.py"]);
    process.stdout.on('data', function(data) {
          if(data) {
              callback(null, data);
          } else {
              callback(new Error("No Trending products available"), null);
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

runPython.getCartRecommendedProducts = function (callback) {
  console.log("runPython: getCartRecommendedProducts");
    var process = spawn('python',["./python/cart_recommendation.py"]);
    process.stdout.on('data', function(data) {
          console.log("runPython: cart_recommendation");
          callback(null, data);
    })
}

module.exports = runPython;
