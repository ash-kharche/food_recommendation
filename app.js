var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(routes);
const PORT = process.env.PORT || 3000;

var db_pool = require('./helpers/db');
db_pool.connect(function (err, client) {
    if (err) {
        console.log("Database error in app.js: " + err.message);
    } else {
        console.log("Database connected in app.js: " + client);
        app.listen(PORT, function (err, client) {
            if (err) {
                console.log("Our Food Recommendation app has ERROR:  " + err.message);
            } else {
                console.log("Our Food Recommendation app is running on port ${" + PORT + "}");
            }
        });
    }

});



/*const fs = require('fs');
const ps = require('python-shell');

var hybridPath = fs.realpathSync('./python/dummy.py', []);
var usersPath = fs.realpathSync('./python/csv_data/users.csv', []);
var foodPath = fs.realpathSync('./python//csv_data/food.csv', []);
var ratingsPath = fs.realpathSync('./python//csv_data/ratings.csv', []);
var toBeRatedPath = fs.realpathSync('./python//csv_data/toBeRated.csv', []);

var options = {
    args: [usersPath, foodPath, ratingsPath, toBeRatedPath]
};

ps.PythonShell.run(hybridPath, options, function (err, results) {
    if (err) {
        console.log('getUserRecommendedProducts:: error:\n\n %j', err);
        //res.status(200).send([]);
    } else {
        console.log('getUserRecommendedProducts:: results:\n\n %j', results);
        //res.status(200).send(results);
    }
});
*/
