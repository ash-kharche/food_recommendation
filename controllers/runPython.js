"use strict";
var db_pool = require('./../helpers/db');
var spawn = require("child_process").spawn;
var runPython = {};

runPython.test = function (req, res) {
    var process = spawn('python', ["./python/hello.py"]);
    process.stdout.on('data', function (data) {
        console.log("hello ...");
        res.send(data.toString());
    })
},

    runPython.getTrendingProducts = function (callback) {
        //console.log("\nrunPython: getTrendingProducts");
        var process = spawn('python', ["./python/trending_products.py"]);
        process.stdout.on('data', function (data) {
            if (data) {
                callback(null, data);
            } else {
                callback(new Error("No Trending products available"), null);
            }
        })
    },

    runPython.getRecommendedProducts = function (userId, callback) {
        console.log("\nrunPython: getRecommendedProducts");
        var process = spawn('python', ["./python/trending_products.py"]);
        process.stdout.on('data', function (data) {
            if (data) {
                console.log("runPython: recommendation");
                callback(null, data);
            }
        })
    },

    runPython.getRecommendedProducts1 = function (userId, callback) {
        console.log("\nrunPython: getRecommendedProducts");
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(new Error("DB not connected"), null);
            } else {
                var query = "SELECT * FROM orders WHERE user_id = " + userId;
                client.query(query, function (err, result) {
                    //done();

                    if (err) {
                        console.log(err);
                        callback(new Error("No User available"), null);

                    } else {

                        var ingredientsIdList = [];
                        var myString = "";
                        for (var i = 0; i < result.rows.length; i++) {
                            var order = result.rows[i];
                            for (var k = 0; k < order.products.length; k++) {
                                //console.log("\n&&&&&&&&&&&&&&&\t product_id:   " + order.products[k].product_id);
                                ingredientsIdList.push(order.products[k].ingredients);
                                myString = myString + "," + order.products[k].ingredients;
                            }
                        }
                        console.log("\n********* myString:   " + myString);
                        var productsArray = [];

                        //for (var i = 0; i < ingredientsIdList.length; i++) {
                        //console.log("\n*********t ingredients from array:   " + ingredientsIdList[i]);

                        //db_pool.connect(function (err, client, done) {
                        //if (err) {
                        //  callback(new Error("DB not connected"), null);
                        //} else {
                        var query = "SELECT * FROM products WHERE ingredients && ARRAY[" + ingredientsIdList + "]";
                        console.log("query:   " + query);
                        client.query(query, function (err, result) {
                            console.log("111");
                            //done();

                            if (err) {
                                console.log("222");
                                console.log(err);
                                callback(new Error("No products found matching ingredients"), null);

                            } else {
                                console.log("333");
                                console.log("\n*********t products" + result.rows);
                                productsArray.push(result.rows); //TODO check if multiple products available
                            }


                        });
                        //}
                        //});
                        //}


                        done();
                        callback(null, productsArray);

                    }
                });
            }
        });
    },

    runPython.getCartRecommendedProducts = function (callback) {
        console.log("\nrunPython: getCartRecommendedProducts");
        var process = spawn('python', ["./python/cart_recommendation.py"]);
        process.stdout.on('data', function (data) {
            console.log("runPython: cart_recommendation");
            callback(null, data);
        })
    }

module.exports = runPython;
