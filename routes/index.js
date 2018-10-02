var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

router.get('/test', controllers.apiProducts.getCollections);
router.get('/test2', controllers.apiProducts.getAllProducts);

router.put('/login', controllers.apiUser.login);
router.put('/signUpUser', controllers.apiUser.signUpUser);

router.get('/getAllProducts', controllers.apiProducts.getAllProducts);
router.get('/getTrendingProducts', controllers.apiProducts.getAllProducts);
router.get('/getRecommendedProducts', controllers.apiProducts.getAllProducts);
router.get('/getCollections', controllers.apiProducts.getCollections);

module.exports = router;