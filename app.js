var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(routes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, function (err, client) {
    if(err) {
        console.log("Our Food Recommendation app has ERROR:  " +err.message);
    } else {
        console.log("Our Food Recommendation app is running on port ${"+ PORT +"}");
    }
});

/*var db_pool = require('./helpers/db');
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

});*/
