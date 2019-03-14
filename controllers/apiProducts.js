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
                        data.collections = [];
                        return reject();
                    } else {
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

            /*var getRecommendedProductsPromise = new Promise(function (resolve, reject) {
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
            ,
            getRecommendedProductsPromise*/

            Promise.all([
                getCollectionsDBPromise,
                getProductsPromise,
                getTrendingProductsPromise
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

                var whereString = "";
                if (is_veg == 0) {
                    if (diabetes == 1 && cholestrol == 0) {
                      whereString = "WHERE (is_diabetes = " + diabetes + ")";
                    } else if (diabetes == 0 && cholestrol == 1) {
                      whereString = "WHERE (is_cholestrol = " + cholestrol + ")";
                    } else if (diabetes == 1 && cholestrol == 1) {
                      whereString = "WHERE (is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                    }
                } else {
                  if (diabetes == 1 && cholestrol == 0) {
                    whereString = "WHERE (is_veg = 1 AND is_diabetes = " + diabetes + ")";
                  } else if (diabetes == 0 && cholestrol == 1) {
                    whereString = "WHERE (is_veg = 1 AND is_cholestrol = " + cholestrol + ")";

                  } else if (diabetes == 1 && cholestrol == 1) {
                    whereString = "WHERE (is_veg = 1 AND is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                  }
                }
                var query = "SELECT * FROM products " + whereString +" ORDER BY rating ASC";
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

                var whereString = "";
                if (is_veg == 0) {
                    if (diabetes == 1 && cholestrol == 0) {
                      whereString = "WHERE (is_diabetes = " + diabetes + ")";
                    } else if (diabetes == 0 && cholestrol == 1) {
                      whereString = "WHERE (is_cholestrol = " + cholestrol + ")";
                    } else if (diabetes == 1 && cholestrol == 1) {
                      whereString = "WHERE (is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                    }
                } else {
                  if (diabetes == 1 && cholestrol == 0) {
                    whereString = "WHERE (is_veg = 1 AND is_diabetes = " + diabetes + ")";
                  } else if (diabetes == 0 && cholestrol == 1) {
                    whereString = "WHERE (is_veg = 1 AND is_cholestrol = " + cholestrol + ")";
                  } else if (diabetes == 1 && cholestrol == 1) {
                    whereString = "WHERE (is_veg = 1 AND is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                  }
                }

                var query = "SELECT * FROM products " + whereString + " ORDER BY rating LIMIT 5";
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

    apiProducts.getUserRecommendedProducts = function (req, res) {
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
              var user_id = req.params.user_id;
              var is_veg = req.params.is_veg;
              var diabetes = req.params.diabetes;
              var bp = req.params.bp;
              var cholestrol = req.params.cholestrol;
              var special_case = req.params.special_case;

                var query = "SELECT * FROM orders WHERE user_id = " + user_id;
                client.query(query, function (err, result) {
                    //done();
                    if (err) {
                        res.status(400).send(err);

                    } else {

                        var ingredientsIdList = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            var order = result.rows[i];
                            for (var k = 0; k < order.products.length; k++) {
                                ingredientsIdList.push(order.products[k].ingredients);
                            }
                        }

                        var unique_array = []
                        for(let i = 0;i < ingredientsIdList.length; i++){
                            if(unique_array.indexOf(ingredientsIdList[i]) == -1){
                                unique_array.push(ingredientsIdList[i])
                            }
                        }

                        console.log("\n********* ingredientsIdList:   " + unique_array);

                        var productsArray = [];

                        var whereString = "";
                        if (is_veg == 0) {
                            if (diabetes == 1 && cholestrol == 0) {
                              whereString = "(is_diabetes = " + diabetes + ")";
                            } else if (diabetes == 0 && cholestrol == 1) {
                              whereString = "(is_cholestrol = " + cholestrol + ")";
                            } else if (diabetes == 1 && cholestrol == 1) {
                              whereString = "(is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                            }
                        } else {
                          if (diabetes == 1 && cholestrol == 0) {
                            whereString = "(is_veg = 1 AND is_diabetes = " + diabetes + ")";
                          } else if (diabetes == 0 && cholestrol == 1) {
                            whereString = "(is_veg = 1 AND is_cholestrol = " + cholestrol + ")";
                          } else if (diabetes == 1 && cholestrol == 1) {
                            whereString = "(is_veg = 1 AND is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                          }
                        }

                        var query = "SELECT * FROM products WHERE (ingredients && ARRAY[" + unique_array + "] AND " + whereString + ") ORDER BY rating LIMIT 10";
                        if(whereString == "") {
                          query = "SELECT * FROM products WHERE (ingredients && ARRAY[" + unique_array + "]) ORDER BY rating LIMIT 10";
                        }

                        console.log("user recommended_products: query:   " + query);
                        client.query(query, function (err, result) {
                            done();

                            if (err) {
                                //No products found matching ingredients
                                res.status(200, []);
                            } else {
                                res.status(200, result.rows);
                            }


                        });

                        //done();

                    }
                });
            }
        });
    },

    apiProducts.getUserRecommendedProductsWorking = function (req, res) {
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

                            //var productPresentBoolean = innerProductIdList.includes("77");
                            //console.log("\n********* getCartRecommendedProducts:  innerProductIdList:   " + innerProductIdList + "     productPresentBoolean:  " + productPresentBoolean);
                            console.log("\n********* getCartRecommendedProducts:  innerProductIdList:   " + innerProductIdList);

                            productIdList = productIdList.concat(innerProductIdList);
                        }


                        console.log("\n********* getCartRecommendedProducts:  productIdList:   " + productIdList.toString());

                        var user_id = req.params.user_id;
                        var is_veg = req.params.is_veg;
                        var diabetes = req.params.diabetes;
                        var bp = req.params.bp;
                        var cholestrol = req.params.cholestrol;
                        var special_case = req.params.special_case;

                        var productsArray = [];

                        var whereString = "";
                        if (is_veg == 0) {
                            if (diabetes == 1 && cholestrol == 0) {
                              whereString = "(is_diabetes = " + diabetes + ")";
                            } else if (diabetes == 0 && cholestrol == 1) {
                              whereString = "(is_cholestrol = " + cholestrol + ")";
                            } else if (diabetes == 1 && cholestrol == 1) {
                              whereString = "(is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                            }
                        } else {
                          if (diabetes == 1 && cholestrol == 0) {
                            whereString = "(is_veg = 1 AND is_diabetes = " + diabetes + ")";
                          } else if (diabetes == 0 && cholestrol == 1) {
                            whereString = "(is_veg = 1 AND is_cholestrol = " + cholestrol + ")";
                          } else if (diabetes == 1 && cholestrol == 1) {
                            whereString = "(is_veg = 1 AND is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                          }
                        }

                        var query = "SELECT * FROM products WHERE (product_id IN (" + productIdList.toString() + ") AND " + whereString + ")";
                        if(whereString == "") {
                          query = "SELECT * FROM products WHERE (product_id IN (" + productIdList.toString() + "))";
                        }

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

    apiProducts.getUserRecommendedProductsYetToWork = function (req, res) {
        db_pool.connect(function (err, client, done) {
            if (err) {
                callback(err, null);
            } else {
              var user_id = req.params.user_id;
              var is_veg = req.params.is_veg;
              var diabetes = req.params.diabetes;
              var bp = req.params.bp;
              var cholestrol = req.params.cholestrol;
              var special_case = req.params.special_case;

                var query = "SELECT * FROM orders where user_id = " + user_id;
                client.query(query, function (err, result) {
                    //done();
                    if (err) {
                        res.status(400).send(err);

                    } else {

                        var mainIngredientsIdList = [];

                        for (var i = 0; i < result.rows.length; i++) {
                            var order = result.rows[i];

                            var ingredientsIdList = [];
                            for (var k = 0; k < order.products.length; k++) {
                                ingredientsIdList.push(order.products[k].ingredients);
                            }

                            console.log("\n********* getCartRecommendedProducts:  ingredientsIdList:   " + ingredientsIdList);

                            mainIngredientsIdList = mainIngredientsIdList.push(ingredientsIdList);
                            console.log("\n********* getCartRecommendedProducts:  mainIngredientsIdList:   " + mainIngredientsIdList);
                        }
                        var productsArray = [];

                        var whereString = "";
                        if (is_veg == 0) {
                            if (diabetes == 1 && cholestrol == 0) {
                              whereString = "(is_diabetes = " + diabetes + ")";
                            } else if (diabetes == 0 && cholestrol == 1) {
                              whereString = "(is_cholestrol = " + cholestrol + ")";
                            } else if (diabetes == 1 && cholestrol == 1) {
                              whereString = "(is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                            }
                        } else {
                          if (diabetes == 1 && cholestrol == 0) {
                            whereString = "(is_veg = 1 AND is_diabetes = " + diabetes + ")";
                          } else if (diabetes == 0 && cholestrol == 1) {
                            whereString = "(is_veg = 1 AND is_cholestrol = " + cholestrol + ")";
                          } else if (diabetes == 1 && cholestrol == 1) {
                            whereString = "(is_veg = 1 AND is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                          }
                        }

                        var query = "SELECT * FROM products WHERE (product_id IN (" + productIdList.toString() + ") AND " + whereString + ")";
                        if(whereString == "") {
                          query = "SELECT * FROM products WHERE (product_id IN (" + productIdList.toString() + "))";
                        }

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

              var user_id = req.params.user_id;
              var is_veg = req.params.is_veg;
              var diabetes = req.params.diabetes;
              var bp = req.params.bp;
              var cholestrol = req.params.cholestrol;
              var special_case = req.params.special_case;

              var whereString = "";
              if (is_veg == 0) {
                  if (diabetes == 1 && cholestrol == 0) {
                    whereString = "(is_diabetes = " + diabetes + ")";
                  } else if (diabetes == 0 && cholestrol == 1) {
                    whereString = "(is_cholestrol = " + cholestrol + ")";
                  } else if (diabetes == 1 && cholestrol == 1) {
                    whereString = "(is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                  }
              } else {
                if (diabetes == 1 && cholestrol == 0) {
                  whereString = "(is_veg = 1 AND is_diabetes = " + diabetes + ")";
                } else if (diabetes == 0 && cholestrol == 1) {
                  whereString = "(is_veg = 1 AND is_cholestrol = " + cholestrol + ")";
                } else if (diabetes == 1 && cholestrol == 1) {
                  whereString = "(is_veg = 1 AND is_diabetes = " + diabetes +" AND is_cholestrol = " + cholestrol + ")";
                }
              }

              var query = "select * from (select *, row_number() over (partition by collection_id order by rating) as rownum from products where (collection_id IN (" + req.params.collections + ")) AND " + whereString + ") tmp where rownum < 4";
              if(whereString == "") {
                query = "select * from (select *, row_number() over (partition by collection_id order by rating) as rownum from products where (collection_id IN (" + req.params.collections + "))) tmp where rownum < 4";
              }

                //var query = "SELECT rank_filter.* FROM (SELECT products.*, rank() OVER (PARTITION BY collection_id ORDER BY rating DESC) FROM products WHERE (collection_id IN (" + req.params.collections + ") AND "+ whereString+") rank_filter WHERE RANK <=" + req.params.rank;

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
