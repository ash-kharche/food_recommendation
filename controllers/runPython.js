"use strict";
var spawn = require("child_process").spawn;
var runPython = {};

//https://www.geeksforgeeks.org/run-python-script-node-js-using-child-process-spawn-method/
runPython.test = function (req, res) {
    console.log("Run Python test: 1111");

    var process = spawn('python',["./hello.py"] );
    console.log("Run Python test: 2222");

    process.stdout.on('data', function(err, data) {
        if(err) {
            console.log("Run Python process.stdout.on: Err " + err.message);
            res.send(err);
        } else {
            console.log("Run Python process.stdout.on:  " + data.toString());
            res.send(data.toString());
        }
    })
}
module.exports = runPython;
