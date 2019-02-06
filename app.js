var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(routes);
const PORT = process.env.PORT || 3000;

app.listen(3000, function() {
    console.log('server running on port 3000');
} )

// Function callName() is executed whenever
// url is of the form localhost:3000/name
app.get('/name', callName);

function callName(req, res) {

    // Use child_process.spawn method from
    // child_process module and assign it
    // to variable spawn
    var spawn = require("child_process").spawn;

    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python',["./hello.py",
                            req.query.firstname,
                            req.query.lastname] );

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function(data) {
        res.send(data.toString());
    } )
}

/*app.listen(PORT, function (err, client) {
    if(err) {
        console.log("Our Food Recommendation app has ERROR:  " +err.message);
    } else {
        console.log("Our Food Recommendation app is running on port ${"+ PORT +"}");
    }
});
/*
var db_pool = require('./helpers/db');

db_pool.connect(function (err, client) {
    if (err) {
        console.log("Database error in app.js: " + err.message);
    } else {
        console.log("Database connected in app.js: " + client);
        app.listen(PORT, function (err, client) {
            if(err) {
                console.log("Our Food Recommendation app has ERROR:  " +err.message);
            } else {
                console.log("Our Food Recommendation app is running on port ${"+ PORT +"}");
            }
        });
    }

});
*/
