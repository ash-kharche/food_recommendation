"use strict";

//http://kauegimenes.github.io/jsonexport/
//https://stackoverflow.com/questions/40753803/how-to-insert-variable-from-nodejs-into-a-python-script
//https://stackoverflow.com/questions/41268541/using-pythonshell-module-in-nodejs

var db_pool = require('./../helpers/db');
var jsonexport = require('jsonexport');
const fs = require('fs');
//var PythonShell = require('python-shell');
const ps = require('python-shell');

var apiProducts = require('./../controllers/apiProducts');

var apiRecommendation = {};

var csvOptions = {"includeHeaders": false};

//http://food-recommendation.herokuapp.com/getUserRecommendedProducts_1/5
apiRecommendation.getUserRecommendedProducts = function (req, res) {
    console.log("\n\n\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n\n");
    //console.log("\n@@@@@@@@@@@@@@@@@@\nFile path of hybrid.py   : " + fs.realpathSync('./python/hybrid.py', [])+ "\n\n");
    var user_id = req.params.user_id;

    var userCount = -1;
    var foodCount = -1;
    var usersPath = "";
    var foodPath = "";
    var toBeRatedPath = "";
    var ratingPath = "";

    var getUserCountPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getUsersCount(function (err, count) {
            if (err) {
                //console.log("getUsersCountPromise : err    :" + err);
                return reject();
            } else {
                //console.log("getUsersCountPromise : success    :" + count);
                userCount = count;
                return resolve(count);
            }
        });
    });

    var getFoodCountPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getFoodCount(function (err, count) {
            if (err) {
                //console.log("getFoodCountPromise : err    :" + err);
                return reject();
            } else {
                //console.log("getFoodCountPromise : success    :" + count);
                foodCount = count;
                return resolve(count);
            }
        });
    });

    var getAllUsersPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getAllUsersFormattedCsv(function (err, path) {
            if (err) {
                //console.log("getAllUsersPromise : err    :" + err);
                return reject();
            } else {
                //console.log("getAllUsersPromise : success    :" + path);
                usersPath = path;
                return resolve(path);
            }
        });
    });

    var getFoodPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getFood(function (err, path) {
            if (err) {
                //console.log("getFoodPromise : err    :" + err);
                return reject();
            } else {
                //console.log("getFoodPromise : success    :" + path);
                foodPath = path;
                return resolve(path);
            }
        });
    });

    var getToBeRatedPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getYetToBeRatedProductsPerUser(user_id, function (err, path) {
            if (err) {
                //console.log("getToBeRatedPromise : err    :" + err);
                return reject();
            } else {
                //console.log("getToBeRatedPromise : success    :" + path);
                toBeRatedPath = path;
                return resolve(path);
            }
        });
    });

    var getUserRatedProductsPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getUserRatedProducts(function (err, path) {
            if (err) {
                //console.log("getUserRatedProducts : err    :" + err);
                return reject();
            } else {
                //console.log("getUserRatedProducts : success    :" + path);
                ratingPath = path;
                return resolve(path);
            }
        });
    });

    Promise.all([
        getUserCountPromise,
        getFoodCountPromise,
        getUserRatedProductsPromise,
        getAllUsersPromise,
        getFoodPromise,
        getToBeRatedPromise
    ])
        .then(function (values) {
            //console.log("\ngetUserRecommendedProducts :: values:   " + values);

            var hybridPath = fs.realpathSync('./python/hybrid.py', []);
            var rmseHybridPath = fs.realpathSync('./python/csv_data/rmse_hybrid.txt', []);
            var resultPath = fs.realpathSync('./python/csv_data/result3.csv', []);

            var options = {
                args: [userCount, foodCount, ratingPath, usersPath, foodPath, rmseHybridPath, toBeRatedPath, resultPath]
            };

            ps.PythonShell.run(hybridPath, options, function (err, results) {
                if (err) {
                    console.log('getUserRecommendedProducts:: error:\n\n %j', err);
                    res.status(200).send([]);
                } else {
                    console.log('getUserRecommendedProducts:: results:\n %j', results);
                    /*var resultsArray = JSON.parse(results);
                    var array = [];
                    array.push(resultsArray);
                    var array1 = [];
                    for(var i = 0; i < 10; i++) {
                      array1.push(array[i]);
                    }*/
                    apiRecommendation.getProducts(results, function (err, products) {
                        if (err) {
                            res.status(200).send([]);
                        } else {
                            res.status(200).send(products);
                        }
                    });
                    //res.status(200).send(results);

                }
            });

        }).catch(err => {
        console.log("\ngetUserRecommendedProducts :: error: " + err);
        //res.status(400).send(err);
        res.status(200).send([]);
    });
}

apiRecommendation.getYetToBeRatedProductsPerUser = function (user_id, callback) {
    //var user_id = req.params.user_id;

    apiProducts.getUserPastOrders(user_id, function (err, pastOrders) {
        if (err) {
            //res.status(200).send([]);
            callback(null, []);
        } else {
            /// find products and related ingredients from these apiProducts
            //not done for collections, as we have limited collections
            var productIdList = [];
            for (var i = 0; i < pastOrders.length; i++) {
                var order = pastOrders[i];
                for (var k = 0; k < order.products.length; k++) {
                    productIdList.push(order.products[k].product_id);
                }
            }

            var uniqueProductIds = apiProducts.getUniqueId(productIdList);
            //console.log("\ngetYetToBeRatedProductsPerUser: uniqueProductIds :   " + uniqueProductIds);

            var query = "SELECT product_id FROM products WHERE product_id NOT IN (" + uniqueProductIds + ") ORDER BY product_id";
            //console.log("getYetToBeRatedProductsPerUser:   query :  " + query);

            apiProducts.getUnEatenProducts(query, function (err, productsArray) {
                if (err) {
                    console.log(err);
                    callback(null, []);
                } else {

                    var productsFormattedArray = [];

                    for (var i = 0; i < productsArray.length; i++) {
                        var product = productsArray[i];
                        var modifiedProduct = {};
                        modifiedProduct.user_id = user_id;
                        modifiedProduct.product_id = product.product_id;
                        productsFormattedArray.push(modifiedProduct);
                    }
                    var path = './data/yet_to_be_rated_products_per_user_' + user_id + '.csv';

                    jsonexport(productsFormattedArray, csvOptions, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log("path:  \n" + csv);
                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            //console.log('apiRecommendation.getYetToBeRatedProductsPerUser saved ' + path + "\n\n");

                            var jsonString = fs.readFileSync(path, 'utf8');
                            console.log('apiRecommendation.getYetToBeRatedProductsPerUser in csv:\n ' + jsonString + "\n\n");
                            apiRecommendation.writeToFile("./dummy_data/test_toberated.csv", jsonString);
                        });
                    });
                    callback(null, path);
                }
            });
        }
    });
}

apiRecommendation.getAllUsers = function (callback) {
    var query = "SELECT * FROM users ORDER BY user_id";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {

                    var usersArray = result.rows;
                    var usersFormattedArray = [];

                    for (var i = 0; i < usersArray.length; i++) {
                        var user = usersArray[i];
                        var modifiedUser = {};
                        modifiedUser.user_id = user.user_id;

                        if (user.is_veg == 1) {
                            modifiedUser.is_veg = 1;//"veg";
                        } else {
                            modifiedUser.is_veg = 0;//"non_veg";
                        }

                        if (user.is_diabetes == 1) {
                            modifiedUser.is_diabetes = 1;
                        } else {
                            modifiedUser.is_diabetes = 0;
                        }

                        if (user.is_cholestrol == 1) {
                            modifiedUser.is_cholestrol = 1;
                        } else {
                            modifiedUser.is_cholestrol = 0;
                        }
                        usersFormattedArray.push(modifiedUser);
                    }
                    var path = './data/all_users.csv';

                    jsonexport(usersFormattedArray, csvOptions, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log(csv);
                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            //console.log('getAllUsers saved ' + path + "\n\n");

                            var jsonString = fs.readFileSync(path, 'utf8');
                            console.log('getAllUsers in csv \n\n' + jsonString + "\n\n");
                            apiRecommendation.writeToFile("./dummy_data/test_userspath.csv", jsonString);
                        });
                    });

                    callback(null, path);
                }
            });
        }
    });
}

apiRecommendation.getAllUsersFormattedCsv = function (callback) {
    var query = "SELECT * FROM users ORDER BY user_id DESC";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {

                    var usersFormattedArray = [];
                    var lastUserId = result.rows[0].user_id;
                    console.log("lastUserId:   " + lastUserId);

                    for (var i = 0; i < lastUserId; i++) {
                        var modifiedUser = {};
                        modifiedUser.user_id = 0;
                        modifiedUser.is_veg = 0;//"veg";
                        modifiedUser.is_diabetes = 0;
                        modifiedUser.is_cholestrol = 0;
                        usersFormattedArray.push(modifiedUser);
                    }

                    var usersArray = result.rows;
                    for (var i = 0; i < usersArray.length; i++) {
                        var user = usersArray[i];
                        var modifiedUser = {};
                        modifiedUser.user_id = user.user_id;

                        if (user.is_veg == 1) {
                            modifiedUser.is_veg = 1;//"veg";
                        } else {
                            modifiedUser.is_veg = 0;
                        }
                        if (user.is_diabetes == 1) {
                            modifiedUser.is_diabetes = 1;
                        } else {
                            modifiedUser.is_diabetes = 0;
                        }
                        if (user.is_cholestrol == 1) {
                            modifiedUser.is_cholestrol = 1;
                        } else {
                            modifiedUser.is_cholestrol = 0;
                        }
                        usersFormattedArray.splice(user.user_id, 1, modifiedUser);
                    }
                    var path = './data/users.csv';

                    jsonexport(usersFormattedArray, csvOptions, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log(csv);

                        /*try {
                          fs.unlinkSync(path);
                        } catch (ex) {
                          callback(ex, null);
                        }*/

                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            //console.log('getAllUsers saved ' + path + "\n\n");

                            var jsonString = fs.readFileSync(path, 'utf8');
                            //console.log('getAllUsers in csv \n\n' + jsonString + "\n\n");
                            apiRecommendation.writeToFile("./dummy_data/test_userspath.csv", jsonString);
                        });
                    });

                    callback(null, path);
                }
            });
        }
    });
}

apiRecommendation.getFood = function (callback) {
    var query = "SELECT * FROM products ORDER BY product_id";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {

                    var foodArray = result.rows;
                    var foodFormattedArray = [];

                    for (var i = 0; i < foodArray.length; i++) {
                        var food = foodArray[i];
                        var modifiedFood = {};
                        modifiedFood.product_id = food.product_id;
                        modifiedFood.product_name = food.product_name;

                        var type = "veg";

                        if (food.is_veg == 0) {
                            type = type + "|non-veg";
                        }

                        if (food.is_diabetes == 1) {
                            type = type + "|diabetes";
                        }

                        if (food.is_cholestrol == 1) {
                            type = type + "|cholestrol";
                        }
                        modifiedFood.type = type;

                        foodFormattedArray.push(modifiedFood);
                    }
                    var path = './data/food.csv';

                    jsonexport(foodFormattedArray, csvOptions, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log(csv);
                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            //console.log('getFood saved ' + path + "\n\n");

                            var jsonString = fs.readFileSync(path, 'utf8');
                            //console.log('getFood in csv \n\n' + jsonString + "\n\n");
                            apiRecommendation.writeToFile("./dummy_data/test_foodpath.csv", jsonString);
                        });
                    });

                    callback(null, path);
                }
            });
        }
    });
}

apiRecommendation.getUserRatedProducts = function (callback) {
    var query = "SELECT user_id, product_id, CAST (rating AS INTEGER) FROM rated_orders ORDER BY user_id, product_id, rating";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {

                    var ratedOrdersArray = result.rows;
                    var path = './data/user_rated_products.csv';

                    jsonexport(ratedOrdersArray, csvOptions, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log(csv);
                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            //console.log('getUserRatedProducts saved ' + path + "\n\n");

                            var jsonString = fs.readFileSync(path, 'utf8');
                            console.log('getUserRatedProducts in csv \n\n' + jsonString + "\n\n");
                            apiRecommendation.writeToFile("./dummy_data/test_rating.csv", jsonString);
                        });
                    });

                    callback(null, path);
                }
            });
        }
    });
}

apiRecommendation.getUsersCount = function (callback) {
    var query = "SELECT user_id FROM users ORDER BY user_id DESC";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {
                    var lastUserId = result.rows[0].user_id;
                    //callback(null, result.rows.length);
                    callback(null, lastUserId + 1);
                }
            });
        }
    });
}

apiRecommendation.getFoodCount = function (callback) {
    var query = "SELECT product_id FROM products order by product_id DESC LIMIT 1";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result.rows[0].product_id);
                }
            });
        }
    });
}

apiRecommendation.getProducts = function (productIdList, callback) {
    var randomNumber = apiRecommendation.getRandomInt(300);
    console.log("randomNumber:   " + randomNumber);
    var query = "SELECT * FROM products where product_id in(" + productIdList + ") LIMIT 10 OFFSET " + randomNumber;
    console.log("getProducts:  query  " + query);
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

apiRecommendation.getRandomInt = function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

apiRecommendation.writeToFile = function writeToFile(fileName, text) {
  //./dummy_data/test_data.csv
    fs.writeFile(fileName, text, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("The file was saved!");
    });

    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
        }

        var query = "INSERT INTO keys (name, value) VALUES ($1, $2) RETURNING *";
        client.query(query, [fileName, text],

            function (err, result) {
                done();
                if (err) {
                    console.log(err);
                } else {
                    console.log("$$$$$$ writeToFile:   " + result.rows[0]);
                }
            });
    });
}

module.exports = apiRecommendation;
