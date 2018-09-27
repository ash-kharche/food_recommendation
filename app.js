var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(routes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our Food Recommendation app is running on port ${ PORT }`);
});