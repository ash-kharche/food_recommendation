"use strict";

var runPython = {};
//https://www.geeksforgeeks.org/run-python-script-node-js-using-child-process-spawn-method/
runPython.test = function (req, res) {
  console.log("Run Python test");
    var spawn = require("child_process").spawn;
    var process = spawn('python',["./hello.py"] );
    process.stdout.on('data', function(data) {
        console.log("Run Python process.stdout.on:  " + data.toString());
        res.send(data.toString());
    } )
}


module.exports = runPython;
