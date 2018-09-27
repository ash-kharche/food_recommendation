var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(routes);
//app.set('port', (process.env.PORT || 3010));
app.listen(3010, function () {
    console.log("Hey! welcome to food recommendation on port 3010");
});