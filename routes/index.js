var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

router.get('/*', controllers.apiUser.test);
router.get('/test', controllers.apiUser.test);
router.put('/login', controllers.apiUser.login);
router.put('/signUpUser', controllers.apiUser.signUpUser);

module.exports = router;