var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

router.get('/*', controllers.apiUser.test);
router.get('/test', controllers.apiUser.test);
router.get('/login', controllers.apiUser.login);
router.put('/signUpUser', controllers.apiUser.signUpUser);

module.exports = router;


//Pushing code via terminal to Heroku
//git commit -m "Test: app not running"
//git push heroku master

//CREATE TABLE users(user_id serial PRIMARY KEY, username VARCHAR (50) UNIQUE NOT NULL,password VARCHAR (50) NOT NULL,email VARCHAR (355) UNIQUE NOT NULL,created_on TIMESTAMP NOT NULL,last_login TIMESTAMP);