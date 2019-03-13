"use strict";

var db_pool = require('./../helpers/db');
var runPython = require('./../controllers/runPython');
var apiProducts = {};

apiProducts.getData = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("#### not able to get connection " + err);
            res.status(400).send(err);

        } else {

            var user_id = req.params.user_id;
            var is_veg = req.params.is_veg;
            var diabetes = req.params.diabetes;
            var bp = req.params.bp;
            var cholestrol = req.params.cholestrol;
            var special_case = req.params.special_case;

            var data = {};

            var getCollectionsDBPromise = new Promise(function (resolve, reject) {
                apiProducts.getCollectionsDB(function (err, response) {
                    if (err) {
                        //console.log("ApiProducts : getCollectionsDB    :" + err);
                        data.collections = [];
                        return reject();
                    } else {
                        //console.log("ApiProducts : getCollectionsDB    :" + response);
                        data.collections = response;
                        return resolve(response);
                    }
                });
            });

            var getProductsPromise = new Promise(function (resolve, reject) {
                apiProducts.getProducts(is_veg, diabetes, bp, cholestrol, special_case, function (err, response) {
                    if (err) {
                        //console.log("ApiProducts : getProducts    :" + err);
                        data.products = [];
                        return reject();
                    } else {
                        //console.log("ApiProducts : getProducts    :" + response);
                        data.products = response;
                        return resolve(response);
                    }
                });
            });

            var getTrendingProductsPromise = new Promise(function (resolve, reject) {
                apiProducts.getTrendingProducts(is_veg, diabetes, bp, cholestrol, special_case, function (err, response) {
                    if (err) {
                        //console.log("ApiProducts : trending_products    :" + err);
                        data.trending_products = [];
                        return reject();
                    } else {
                        //console.log("ApiProducts : trending_products    :" + response);
                        data.trending_products = response;
                        return resolve(response);
                    }
                });
            });

            var getRecommendedProductsPromise = new Promise(function (resolve, reject) {
                apiProducts.getRecommendedProducts(user_id, is_veg, diabetes, bp, cholestrol, special_case, function (err, response) {
                    if (err) {
                        console.log("ApiProducts : ^^^^^^recommended_products    :" + err);
                        data.recommended_products = [];
                        return reject();
                    } else {
                        console.log("ApiProducts : $$$$$$recommended_products    :" + response);
                        data.recommended_products = response;
                        return resolve(response);
                    }
                });
            });

            Promise.all([
                getCollectionsDBPromise,
                getProductsPromise,
                getTrendingProductsPromise,
                getRecommendedProductsPromise
            ])
                .then(function (values) {
                    console.log("\n@@@@@\ApiProducts response send");
                    //console.log(values);
                    res.status(200).send(data);
                }).catch(err => {
                console.log("\n@@@@@\ApiProducts Error\n\n");
                console.error(err);
                res.status(400).send(err);
            });
        }
    });
},

    apiProducts.getCollections = function (req, res) {
        db_pool.connect(function (err, client, done) {
            if (err) {
                console.log("#### not able to get connection " + err);
                res.status(400).send(err);
            }

            var query = "SELECT * FROM collections";
            client.query(query, function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);

                } else {
                    res.status(200).send(result.rows);
                }
            });
        });
    },

    apiProducts.getProducts = function (is_veg, diabetes, bp, cholestrol, special_case, callback) {
        //console.log("\n apiProducts: getProducts");
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
                var query = "SELECT * FROM products WHERE is_veg = " + is_veg;
                client.query(query, function (err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        callback(err, null);

                    } else {
                        callback(null, result.rows);
                    }
                });
            }
        });
    },
    apiProducts.getTrendingProducts = function (is_veg, diabetes, bp, cholestrol, special_case, callback) {
        //console.log("\n apiProducts: getProducts");
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
                var query = "SELECT * FROM products WHERE is_veg = " + is_veg + " ORDER BY rating LIMIT 5";
                client.query(query, function (err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        callback(null, []);
                    } else {
                        callback(null, result.rows);
                    }
                });
            }
        });
    },

    apiProducts.getRecommendedProducts = function (user_id, is_veg, diabetes, bp, cholestrol, special_case, callback) {
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
                var query = "SELECT * FROM orders WHERE user_id = " + user_id;
                client.query(query, function (err, result) {
                    //done();
                    if (err) {
                        callback(err, null);

                    } else {

                        var ingredientsIdList = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            var order = result.rows[i];
                            for (var k = 0; k < order.products.length; k++) {
                                ingredientsIdList.push(order.products[k].ingredients);
                            }
                        }
                        console.log("\n********* ingredientsIdList:   " + ingredientsIdList);

                        var productsArray = [];
                        var query = "SELECT * FROM products WHERE (ingredients && ARRAY[" + ingredientsIdList + "] AND isveg = " + is_veg + ") ORDER BY rating LIMIT 10";
                        console.log("query:   " + query);
                        client.query(query, function (err, result) {
                            done();

                            if (err) {
                              //No products found matching ingredients
                                callback(null, []);
                            } else {
                                callback(null, result.rows);
                            }


                        });

                        //done();

                    }
                });
            }
        });
    },

    apiProducts.getUserRecommendedProducts = function (req, res) {
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
                var query = "SELECT * FROM orders";
                client.query(query, function (err, result) {
                    //done();
                    if (err) {
                        res.status(400).send(err);

                    } else {

                        var productIdList = [];

                        for (var i = 0; i < result.rows.length; i++) {
                            var order = result.rows[i];

                            var innerProductIdList = [];
                            for (var k = 0; k < order.products.length; k++) {
                                innerProductIdList.push(order.products[k].product_id);
                            }

                            var productPresentBoolean = innerProductIdList.includes("77");
                            console.log("\n********* getCartRecommendedProducts:  innerProductIdList:   " + innerProductIdList+"     productPresentBoolean:  " +productPresentBoolean);

                            productIdList = productIdList.concat(innerProductIdList);
                        }


                        console.log("\n********* getCartRecommendedProducts:  productIdList:   " + productIdList.toString());

                        var productsArray = [];
                        var query = "SELECT * FROM products WHERE product_id IN (" + productIdList.toString() + ")";
                        console.log("query:   " + query);
                        client.query(query, function (err, result) {
                            done();

                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.status(200).send(result.rows);
                            }
                        });

                    }
                });
            }
        });
    },

    apiProducts.getCartRecommendedProducts = function (req, res) {
        db_pool.connect(function (err, client, done) {
            if (err) {
                res.status(400).send(err);
            } else {

              var query = "SELECT rank_filter.* FROM (SELECT products.*, rank() OVER (PARTITION BY collection_id ORDER BY rating DESC) FROM products WHERE collection_id IN (" + req.params.collections + ")) rank_filter WHERE RANK <=" + req.params.rank;
              console.log("query:   " + query);
              client.query(query, function (err, result) {
                  done();

                  if (err) {
                      res.status(400).send(err);
                  } else {
                      res.status(200).send(result.rows);
                  }
              });

            }
        });
    },

    apiProducts.getCollectionsDB = function (callback) {
        //console.log("\n apiProducts: getCollectionsDB");
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
                var query = "SELECT * FROM collections";
                client.query(query, function (err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        callback(err, null);

                    } else {
                        callback(null, result.rows);
                    }
                });
            }
        });
    },

    apiProducts.getProductById = function (productId, callback) {
        console.log("\n apiProducts: getProductById::   " + productId);
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
                var query = "SELECT * FROM products WHERE product_id = $1";
                client.query(query, [productId], function (err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        callback(err, null);

                    } else {
                        callback(null, result.rows);
                    }
                });
            }
        });
    }


module.exports = apiProducts;
