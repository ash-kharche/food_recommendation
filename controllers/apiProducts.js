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
                apiProducts.getProducts(function (err, response) {
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
                runPython.getTrendingProducts(function (err, response) {
                    //console.log("ApiProducts:  trending_products " + new Date() + "  \n\n ");
                    if (err) {
                        data.trending_products = [];
                        //console.log("ApiProducts : trending_products ERROR   : " + new Date() + "  \n\n " + err);
                        return reject();
                    } else {
                        //console.log("ApiProducts:  trending_products SUCCESS :  " + new Date() + "  \n\n " + response);
                        data.trending_products = JSON.parse(response);
                        return resolve(response);
                    }
                });
            });

            var getRecommendedProductsPromise = new Promise(function (resolve, reject) {
                runPython.getRecommendedProducts(req.params.user_id, function (err, response) {
                    console.log("ApiProducts:  recommended_products " + new Date() + "   " +req.params.user_id +" \n\n ");
                    if (err) {
                        data.recommended_products = [];
                        console.log("ApiProducts : recommended_products ERROR   : " + new Date() + "  : " + err);
                        return reject();
                    } else {
                        console.log("ApiProducts:  recommended_products SUCCESS :  " + new Date() + " : " + response);
                        data.recommended_products = JSON.parse(response);
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
                    console.log(values);
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
                //call `done()` to release the client back to the pool
                console.log("#### getCollections #1");

                done();
                if (err) {
                    console.log("#### getCollections #2");
                    console.log(err);
                    res.status(400).send(err);

                } else {
                    console.log("#### getCollections #3");
                    res.status(200).send(result.rows);
                }
            });
        });
    },

    apiProducts.getProducts = function (callback) {
        console.log("\n apiProducts: getProducts");
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
                var query = "SELECT * FROM products";
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

    apiProducts.getCollectionsDB = function (callback) {
        console.log("\n apiProducts: getCollectionsDB");
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
        console.log("\n apiProducts: getProductById::   " +productId);
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
