"use strict";

var runPython = {};

runPython.test = function (req, res) {
  var spawn = require("child_process").spawn;

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. List containing Path of the script
    //    and arguments for the script

    // E.g.: http://localhost:3000/name?firstname=Mike&lastname=Will
    // So, first name = Mike and last name = Will
    /*var process = spawn('python',["./hello.py",
                            req.query.firstname,
                            req.query.lastname] );*/
    var process = spawn('python',["./hello.py"] );

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function(data) {
        //res.send(data.toString());
        res.send(JSON.stringify({"message": "Hellow poonam"}));
    } )
}


module.exports = runPython;
