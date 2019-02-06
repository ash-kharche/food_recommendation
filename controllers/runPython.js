"use strict";
var spawn = require("child_process").spawn;
var runPython = {};

//https://www.geeksforgeeks.org/run-python-script-node-js-using-child-process-spawn-method/
/*runPython.test = function (req, res) {
    var process = spawn('python',["./python/hello.py"]);

    process.stdout.on('data', function(data) {
          console.log("11111");
          res.send(data.toString());
    })
}*/

runPython.trending_products = function (req, res) {
    var process = spawn('python',["./python/recommendation.py"]);

    process.stdout.on('data', function(data) {
          //console.log('data', new Buffer(data,'utf-8').toString(););
          console.log("trending_products");
          res.send(data.toString());
    })
}

module.exports = runPython;
