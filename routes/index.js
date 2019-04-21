var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

router.post('/getData', controllers.apiProducts.getData);
router.post('/getUserRecommendedProducts', controllers.apiProducts.getUserRecommendedProducts);
router.post('/getCartRecommendedProducts', controllers.apiProducts.getCartRecommendedProducts);
router.get('/getUserRecommendedProducts_1/:user_id', controllers.apiRecommendation.getUserRecommendedProducts);

router.put('/login', controllers.apiUser.login);
router.put('/signUpUser', controllers.apiUser.signUpUser);
router.get('/getUser/:user_id', controllers.apiUser.getUser);
router.put('/submitAnswers', controllers.apiUser.submitAnswers);

router.put('/placeOrder', controllers.apiOrder.placeOrder);
router.post('/rateOrder', controllers.apiOrder.rateOrder);
router.get('/getAllOrders/:user_id', controllers.apiOrder.getAllOrders);
router.get('/getOrderDetails/:user_id/:order_id', controllers.apiOrder.getOrderDetails);

module.exports = router;
