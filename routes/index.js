var express = require('express');
var router = express.Router();
var controllers = require("../controllers");

//router.get('/test', controllers.runPython.test);
router.get('/getTrendingProducts/:user_id/:is_veg/:diabetes/:bp/:cholestrol/:special_case', controllers.runPython.getTrendingProducts);
router.get('/getRecommendedProducts/:user_id/:is_veg/:diabetes/:bp/:cholestrol/:special_case', controllers.runPython.getRecommendedProducts);
router.get('/getCartRecommendedProducts/:user_id/:is_veg/:diabetes/:bp/:cholestrol/:special_case', controllers.apiProducts.getCartRecommendedProducts);

router.put('/login', controllers.apiUser.login);
router.put('/logout', controllers.apiUser.logout);
router.put('/signUpUser', controllers.apiUser.signUpUser);
router.get('/getAllUsers', controllers.apiUser.getAllUsers);
router.get('/getUser/:user_id', controllers.apiUser.getUser);

router.get('/getData/:user_id/:is_veg/:diabetes/:bp/:cholestrol/:special_case', controllers.apiProducts.getData);
router.get('/getCollections', controllers.apiProducts.getCollections);
//router.get('/getTrendingProducts', controllers.apiProducts.getTrendingProducts);

router.put('/placeOrder', controllers.apiOrder.placeOrder);
router.get('/getOrderDetails/:user_id/:order_id', controllers.apiOrder.getOrderDetails);
router.get('/getAllOrders/:user_id', controllers.apiOrder.getAllOrders);
router.post('/rateOrder', controllers.apiOrder.rateOrder);


//router.post('/submitAnswers', controllers.apiQuestions.submitAnswers);

module.exports = router;
