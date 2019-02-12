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
            console.log("$$$$$$$$$$$$$$$$$$$$$$$");

            var queryCollections = "SELECT * FROM collections";
            var queryProducts = "SELECT * FROM products";

            var data = {};

            /*
            async.parallel({
                one: apiProducts.getCollectionsDB(callback) {
                    //callback(null, 'abc\n');
                },
                two: apiProducts.getProducts(callback) {
                    //callback(null, 'xyz\n');
                }
            }, function (err, results) {
                // results now equals to: results.one: 'abc\n', results.two: 'xyz\n'

                console.log("ApiProducts : async parallel    :" + results);
            });


            Promise.all([
                client.query(queryCollections,function(err, result) {
                        done();
                        data.collections = [];
                        if(err){
                            console.log(err);
                        } else {
                           //data.collections = result.rows;
                         }
                    }),
                    client.query(queryProducts,function(err, result) {
                        done();
                        data.products = [];
                        if(err) {
                            console.log(err);
                        } else {
                           //data.products = result.rows;
                         }
                    }),
                    runPython.getTrendingProducts(function (err, response) {
                      console.log("ApiProducts:  trending_products " + new Date() +"  \n\n ");
                        if (err) {
                            data.trending_products = [];
                            console.log("ApiProducts : trending_products ERROR   : " + new Date() +"  \n\n " + err);

                        } else {
                            console.log("ApiProducts:  trending_products SUCCESS :  " + new Date() +"  \n\n " + response);
                            data.trending_products = JSON.parse(response);
                            //res.status(200).send(data);
                        }
                    }),
                    runPython.getRecommendedProducts(function(err, response) {
                      if(err) {
                          console.log("ApiProducts : recommended_products    :" + err);
                          data.recommended_products = [];
                      } else {
                         console.log("ApiProducts : recommended_products    :" + response);
                         data.recommended_products = JSON.stringify(rresponse);
                       }
                    })

              ])
            .then(function() {
                  console.log("\n@@@@@\ApiProducts response send");
                  res.status(200).send(data);
            }).catch(err => {
                  console.log("\n@@@@@\ApiProducts Error\n\n");
                  console.error(err);
                  res.status(400).send(err);
            });
            */
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
    }


    module.exports = apiProducts;
