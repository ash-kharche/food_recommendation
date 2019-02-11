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
            var queryTrendingProducts = "SELECT * FROM trending_products";
            var queryRecommendedProducts = "SELECT * FROM recommended_products";

            var data = {};
            /*Promise.all([
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
                    runPython.getTrendingProducts(function(err, response) {
                      if(err) {
                          data.trending_products = [];
                          console.log("ApiProducts : trending_products    :" + err);

                      } else {
                          data.trending_products = [];
                          console.log("ApiProducts:  trending_products    :  " +response);
                          data.trending_products = JSON.stringify(response);
                       }
                    }),
                    runPython.getRecommendedProducts(function(err, response) {
                      if(err) {
                          console.log("ApiProducts : recommended_products    :" + err);
                          data.recommended_products = {};
                      } else {
                         console.log("ApiProducts : recommended_products    :" + response);
                         data.recommended_products = [];
                         data.recommended_products = JSON.stringify(rresponse);
                       }
                    })
              ])
            .then(function() {
                  //console.log(data);
                  res.status(200).send(data);
            }).catch(err => {
                  console.error(err);
                  res.status(400).send(err);
            });*/
            runPython.getTrendingProducts(function (err, response) {
              console.log("ApiProducts:  trending_products " + new Date() +"  \n\n ");
                if (err) {
                    data.trending_products = [];
                    console.log("ApiProducts : trending_products ERROR   : " + new Date() +"  \n\n " + err);

                } else {
                    console.log("ApiProducts:  trending_products SUCCESS :  " + new Date() +"  \n\n " + response);
                    //data.trending_products = JSON.parse(response);
                    data.trending_products = response;
                    res.status(200).send(data);
                }
            })
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
    }


module.exports = apiProducts;
