var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

//router.get('/test', controllers.runPython.test);
router.get('/getTrendingProducts', controllers.runPython.getTrendingProducts);
router.get('/getUserRecommendedProducts', controllers.apiProducts.getUserRecommendedProducts);
router.get('/getUserRecommendedProducts_1/:user_id', controllers.apiRecommendation.getUserRecommendedProducts);
router.get('/getCartRecommendedProducts', controllers.apiProducts.getCartRecommendedProducts);
router.get('/calculateNutrients', controllers.apiProducts.calculateNutrients_otherway);

router.put('/login', controllers.apiUser.login);
router.put('/submitAnswers', controllers.apiUser.submitAnswers);
router.put('/signUpUser', controllers.apiUser.signUpUser);
router.get('/getAllUsers', controllers.apiUser.getAllUsers);
router.get('/getUser/:user_id', controllers.apiUser.getUser);

router.get('/getData', controllers.apiProducts.getData);
router.get('/getCollections', controllers.apiProducts.getCollections);
//router.get('/getTrendingProducts', controllers.apiProducts.getTrendingProducts);

router.put('/placeOrder', controllers.apiOrder.placeOrder);
router.get('/getOrderDetails/:user_id/:order_id', controllers.apiOrder.getOrderDetails);
router.get('/getAllOrders/:user_id', controllers.apiOrder.getAllOrders);
router.post('/rateOrder', controllers.apiOrder.rateOrder);

router.get('/convertJsonToCsv', controllers.jsonToCsv.convertJsonToCsv);

//router.post('/submitAnswers', controllers.apiQuestions.submitAnswers);

module.exports = router;
