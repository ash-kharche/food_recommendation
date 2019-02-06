"use strict";
var spawn = require("child_process").spawn;
var runPython = {};

//https://www.geeksforgeeks.org/run-python-script-node-js-using-child-process-spawn-method/
runPython.test = function (req, res) {
    var process = spawn('python',["./python/hello.py",
                            req.query.firstname,
                            req.query.lastname]);

    process.stdout.on('data', function(err, data) {
        if(err) {
            console.log("Run Python process.stdout.on: Err " + err.message);
            res.send(err);
        } else {
            console.log("Run Python process.stdout.on:  " + data.toString());
            res.send({"message":"Hellow Poonam"});
        }
    })
}

runPython.test2 = function (req, res) {
    var process = spawn('python',["./python/test.py"]);

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
