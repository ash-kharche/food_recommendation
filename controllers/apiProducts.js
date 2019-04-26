"use strict";

var db_pool = require('./../helpers/db');
var apiProducts = {};
/*
UPDATE products SET ingredient_text = CONCAT(ingredient_text, ',', ' ', (SELECT name FROM ingredient_nutrients WHERE ingredient_id = 1)) where '1' = ANY(ingredients);

select * from products where '1' = ANY(ingredients);

select * from ingredient_nutrients;

UPDATE products SET ingredient_text = '';

WITH var1 as (values (1)) select * from products where (table var1) = ANY(ingredients);



WITH var1 as (values (1)) UPDATE products SET ingredient_text = CONCAT(ingredient_text, ',', ' ', (SELECT name FROM ingredient_nutrients WHERE ingredient_id = (table var1))), fats = fats + (SELECT fats FROM ingredient_nutrients WHERE ingredient_id = (table var1)), protiens = protiens + (SELECT protiens FROM ingredient_nutrients WHERE ingredient_id = (table var1)), carbs = carbs + (SELECT carbs FROM ingredient_nutrients WHERE ingredient_id = (table var1)) WHERE (table var1) = ANY(ingredients);

select product_id, fats, protiens, carbs, ingredient_text from products ORDER by product_id;

UPDATE products SET fats = 0;
*/

apiProducts.getData = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("#### not able to get connection " + err);
            res.status(400).send(err);

        } else {

            var user_id = req.body.user_id;
            var isVeg = req.body.is_veg;
            var isDiabetes = req.body.is_diabetes;
            var isCholestrol = req.body.is_cholestrol;
            var isKid = req.body.is_kid;
            var isSenior = req.body.is_senior;

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
                apiProducts.getProducts(isVeg, isDiabetes, isCholestrol, isKid, isSenior, function (err, response) {
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
                apiProducts.getTrendingProducts(isVeg, isDiabetes, isCholestrol, isKid, isSenior, function (err, response) {
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
}

apiProducts.getUserRecommendedProducts = function (req, res) {
    var user_id = req.body.user_id;
    var isVeg = req.body.is_veg;
    var isDiabetes = req.body.is_diabetes;
    var isCholestrol = req.body.is_cholestrol;
    var isKid = req.body.is_kid;
    var isSenior = req.body.is_senior;

    apiProducts.getUserPastOrders(user_id, function (err, pastOrders) {
        if (err) {
            res.status(200).send([]);
        } else {
            /// find products and related ingredients from these apiProducts
            //not done for collections, as we have limited collections
            var productIdList = [];
            var ingredientsIdList = [];
            for (var i = 0; i < pastOrders.length; i++) {
                var order = pastOrders[i];
                for (var k = 0; k < order.products.length; k++) {
                    productIdList.push(order.products[k].product_id);
                    ingredientsIdList.push(order.products[k].ingredients);
                }
            }

            var uniqueProductIds = apiProducts.getUniqueId(productIdList);
            var uniqueIngredientIds = apiProducts.getUniqueId(ingredientsIdList);
            console.log("\n********* getUserRecommendedProducts: uniqueProductIds :   " + uniqueProductIds + "\nuniqueIngredientIds:   " + uniqueIngredientIds);

            //// end ////
            var whereString = "";
            if (isVeg == 1) {
                whereString = "is_veg = 1";
            } else if (isVeg == 0) {
                whereString = "(is_veg = 0 OR is_veg = 2)";
            }
            if(isDiabetes == 1) {
                whereString = whereString + " AND is_diabetes = 1";
            }
            if(isCholestrol == 1) {
                whereString = whereString + " AND is_cholestrol = 1";
            }
            if(isKid == 1) {
                whereString = whereString + " AND is_kid = 1";
            }
            if(isSenior == 1) {
                whereString = whereString + " AND is_senior = 1";
            }

            /* Less products issue so we dont get response
            var query = "SELECT * FROM products WHERE (ingredients && ARRAY[" + uniqueIngredientIds + "] AND (product_id NOT IN ("+ uniqueProductIds +")) AND " + whereString + ") ORDER BY rating LIMIT 10";
            if (whereString == "") {
                query = "SELECT * FROM products WHERE (ingredients && ARRAY[" + uniqueIngredientIds + "] AND (product_id NOT IN ("+ uniqueProductIds +"))) ORDER BY rating LIMIT 10";
            }*/

            if(uniqueIngredientIds != undefined && uniqueIngredientIds.length > 0) {
                var query = "SELECT * FROM products WHERE (ingredients && ARRAY[" + uniqueIngredientIds + "] AND " + whereString + ") ORDER BY rating LIMIT 10";
                if (whereString == "") {
                    query = "SELECT * FROM products WHERE (ingredients && ARRAY[" + uniqueIngredientIds + "]) ORDER BY rating LIMIT 10";
                }

                console.log("line 257:   query :  " + query);
                apiProducts.getProductsByIngredients(query, function (err, products) {
                    if (err) {
                        console.log(err);
                        res.status(200).send([]);
                    } else {
                        res.status(200).send(products);
                    }
                });
            } else {
                apiProducts.getTrendingProducts(isVeg, isDiabetes, isCholestrol, isKid, isSenior, function (err, response) {
                    if (err) {
                        res.status(200).send([]);
                    } else {
                        res.status(200).send(products);
                    }
                });
            }
        }
    });

}

apiProducts.getCartRecommendedProducts = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            res.status(400).send(err);
        } else {

            var user_id = req.body.user_id;
            var isVeg = req.body.is_veg;
            var isDiabetes = req.body.is_diabetes;
            var isCholestrol = req.body.is_cholestrol;
            var isKid = req.body.is_kid;
            var isSenior = req.body.is_senior;

            var whereString = "";
            if (isVeg == 1) {
              whereString = "is_veg = 1";
            } else if (isVeg == 0) {
              whereString = "(is_veg = 0 OR is_veg = 2)";
            }
            if(isDiabetes == 1) {
              whereString = whereString + " AND is_diabetes = 1";
            }
            if(isCholestrol == 1) {
              whereString = whereString + " AND is_cholestrol = 1";
            }
            if(isKid == 1) {
              whereString = whereString + " AND is_kid = 1";
            }
            if(isSenior == 1) {
              whereString = whereString + " AND is_senior = 1";
            }

            var fromCollectionIds = req.body.collections;
            //Main course  --> Rice/ roti, Salad
            if(req.body.collections == 2) {
              fromCollectionIds = fromCollectionIds + ", 3, 5";
            }
            if(req.body.collections == 3) {
              fromCollectionIds = fromCollectionIds + ", 2, 5";
            }
            if(req.body.collections == 5) {
              fromCollectionIds = fromCollectionIds + ", 2, 3";
            }

            //Snacks --> Beverages
            if(req.body.collections == 1) {
              fromCollectionIds = fromCollectionIds + ", 4";
            }
            if(req.body.collections == 4) {
              fromCollectionIds = fromCollectionIds + ", 1";
            }

            //Soup --> Starters
            if(req.body.collections == 11) {
              fromCollectionIds = fromCollectionIds + ", 12, 6";
            }
            if(req.body.collections == 12) {
              fromCollectionIds = fromCollectionIds + ", 11";
            }

            //Chinese --> Soups
            if(req.body.collections == 6) {
              fromCollectionIds = fromCollectionIds + ", 11";
            }

            var query = "select * from (select *, row_number() over (partition by collection_id order by rating) as rownum from products where (collection_id IN (" + fromCollectionIds + ")) AND (product_id NOT IN (" + req.body.products + ")) AND " + whereString + ") tmp where rownum < 4 ORDER BY product_id";
            if (whereString == "") {
                query = "select * from (select *, row_number() over (partition by collection_id order by rating) as rownum from products where (collection_id IN (" + fromCollectionIds + ")) AND (product_id NOT IN (" + req.body.products + "))) tmp where rownum < 4 ORDER BY product_id";
            }

            console.log("getCartRecommendedProducts:: \nquery:   " + query);
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

apiProducts.getProducts = function (isVeg, isDiabetes, isCholestrol, isKid, isSenior, callback) {
    //console.log("\n apiProducts: getProducts");
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            var whereString = "";
            if (isVeg == 1) {
              whereString = "is_veg = 1";
            } else if (isVeg == 0) {
              whereString = "(is_veg = 0 OR is_veg = 2)";
            }
            if(isDiabetes == 1) {
              whereString = whereString + " AND is_diabetes = 1";
            }
            if(isCholestrol == 1) {
              whereString = whereString + " AND is_cholestrol = 1";
            }
            if(isKid == 1) {
              whereString = whereString + " AND is_kid = 1";
            }
            if(isSenior == 1) {
              whereString = whereString + " AND is_senior = 1";
            }

            var query = "SELECT * FROM products WHERE (" + whereString + ") ORDER BY rating ASC";

            console.log("\n**************** get all products query:  " + query);
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

apiProducts.getTrendingProducts = function (isVeg, isDiabetes, isCholestrol, isKid, isSenior, callback) {
    console.log("\n apiProducts: getTrendingProducts");
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {

          //poonam
          var whereString = "";
          if (isVeg == 1) {
            whereString = "is_veg = 1";
          } else if (isVeg == 0) {
            whereString = "(is_veg = 0 OR is_veg = 2)";
          }
          if(isDiabetes == 1) {
            whereString = whereString + " AND is_diabetes = 1";
          }
          if(isCholestrol == 1) {
            whereString = whereString + " AND is_cholestrol = 1";
          }
          if(isKid == 1) {
            whereString = whereString + " AND is_kid = 1";
          }
          if(isSenior == 1) {
            whereString = whereString + " AND is_senior = 1";
          }

            var query = "SELECT * FROM products WHERE (" + whereString + ") ORDER BY rating LIMIT 5";
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
}

apiProducts.getUserPastOrders = function (user_id, callback) {
    var query = "SELECT * FROM orders WHERE user_id = " + user_id + " ORDER BY user_id";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {

            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result.rows);
                }
            });
        }
    });
}

apiProducts.getUnEatenProducts = function (query, callback) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {

            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result.rows);
                }
            });
        }
    });
}

apiProducts.getUniqueId = function (str) {
    var unique_array = []
    if (str != undefined) {
        var arr = str.toString().split(",");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] != '0' && unique_array.indexOf(arr[i]) == -1) {
                unique_array.push(arr[i])
            }
        }
    }
    return unique_array;
}

apiProducts.getProductsByIngredients = function (query, callback) {
    console.log("######## getProductsByIngredients: query:" + query);

    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("######## getProductsByIngredients: DB error  " + err);
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    console.log("######## getProductsByIngredients: No products found matching ingredients  " + err);
                    callback(err, null);
                } else {
                    console.log("######## getProductsByIngredients: products found matching ingredients\n\n   " + result.rows);
                    callback(null, result.rows);
                }
            });
        }
    });

}

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
}

apiProducts.updateProductRating = function (productId, rating, callback) {

    apiProducts.getProductRating(productId, function (err, productRating) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {

            console.log("\n apiProducts: updateProductRating: productId::   " + productId + "   rating  " + productRating);
            db_pool.connect(function (err, client, done) {
                if (err) {
                    callback(err, null);
                } else {
                    var newRating = (rating + productRating) / 2;
                    var query = "UPDATE products SET rating = " + newRating + " WHERE product_id = $1 RETURNING * ";
                    console.log("\n apiProducts: updateProductRating: query:  " + query);
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
    });
}

apiProducts.getProductRating = function (productId, callback) {
    console.log("\n apiProducts: getProductRating:: productId  " + productId);
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            var query = "SELECT rating FROM products WHERE product_id = $1";
            client.query(query, [productId], function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    console.log("\n apiProducts: getProductRating:: productId  " + productId+"  has rating:  " +result.rows[0].rating);
                    callback(null, result.rows[0].rating);
                }
            });
        }
    });
}

module.exports = apiProducts;
