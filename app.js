var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(routes);
//app.set('port', (process.env.PORT || 3010));
app.listen(process.env.PORT || 3010, function () {
	var port = server.address().port;
    console.log("Hey! welcome to food recommendation on " + port+ "port");
});