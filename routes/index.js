var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

//router.get('/test', controllers.runPython.test);
router.get('/getTrendingProducts', controllers.runPython.getTrendingProducts);
router.get('/getRecommendedProducts', controllers.runPython.getRecommendedProducts);
router.get('/getCartRecommendedProducts', controllers.runPython.getCartRecommendedProducts);

router.put('/login', controllers.apiUser.login);
router.put('/logout', controllers.apiUser.logout);
router.put('/signUpUser', controllers.apiUser.signUpUser);
router.get('/getAllUsers', controllers.apiUser.getAllUsers);
router.get('/getUser/:userId', controllers.apiUser.getUser);

router.get('/getData', controllers.apiProducts.getData);
router.get('/getCollections', controllers.apiProducts.getCollections);
//router.get('/getTrendingProducts', controllers.apiProducts.getTrendingProducts);

router.put('/placeOrder', controllers.apiOrder.placeOrder);
router.get('/getOrderDetails/:userId/:orderId', controllers.apiOrder.getOrderDetails);
router.get('/getAllOrders/:userId', controllers.apiOrder.getAllOrders);
router.get('/rateProductPerOrder', controllers.apiOrder.rateProductPerOrder);


//router.post('/submitAnswers', controllers.apiQuestions.submitAnswers);

module.exports = router;
