"use strict";
var spawn = require("child_process").spawn;
var runPython = {};

//https://www.geeksforgeeks.org/run-python-script-node-js-using-child-process-spawn-method/
runPython.test = function (req, res) {
    var process = spawn('python',["./python/hello.py"]);

    process.stdout.on('data', function(data) {
          console.log("Test1 success:  " + data.toString());
          res.send(data.toString());
    })
},

runPython.test1 = function (req, res) {
    var process = spawn('python',["./python/recommendation.py"]);

    process.stdout.on('data', function(data) {
          //console.log('data', new Buffer(data,'utf-8').toString(););
          console.log("Test2 success:  " + data.toString());
          res.send(data.toString());
    })
}

module.exports = runPython;
