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
    var process = spawn('python',["./python/trending_products.py"]);
    process.stdout.on('data', function(data) {
          console.log("trending_products");
          res.send(JSON.stringify(data.toString()));
    })
},

runPython.getYouMayLike = function (req, res) {
    var process = spawn('python',["./python/you_may_like.py"]);
    process.stdout.on('data', function(data) {
          console.log("you_may_like");
          res.send(JSON.stringify(data.toString()));
    })
}

module.exports = runPython;
