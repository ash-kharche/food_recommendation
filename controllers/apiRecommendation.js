"use strict";

//http://kauegimenes.github.io/jsonexport/
//https://stackoverflow.com/questions/40753803/how-to-insert-variable-from-nodejs-into-a-python-script

var db_pool = require('./../helpers/db');
var jsonexport = require('jsonexport');
const fs = require('fs');
//var PythonShell = require('python-shell');
const ps = require('python-shell');

var apiProducts = require('./../controllers/apiProducts');

var apiRecommendation = {};

//http://food-recommendation.herokuapp.com/getUserRecommendedProducts_1/5
apiRecommendation.getUserRecommendedProducts = function (req, res) {
    console.log("\n\n\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n\n");
    var user_id = req.params.user_id;

    var userCount = -1;
    var yetToBeRatedProductsPerUserFile = undefined;
    var userRatedProductsFile = undefined;


    var getUserCountPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getUsersCount(function (err, count) {
            if (err) {
                console.log("getUsersCountPromise : err    :" + err);
                return reject();
            } else {
                console.log("getUsersCountPromise : success    :" + count);
                userCount = count;
                return resolve(count);
            }
        });
    });

    var getYetToBeRatedProductsPerUserPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getYetToBeRatedProductsPerUser(user_id, function (err, path) {
            if (err) {
                console.log("getYetToBeRatedProductsPerUserPromise : err    :" + err);
                return reject();
            } else {
                console.log("getYetToBeRatedProductsPerUserPromise : success    :" + path);
                yetToBeRatedProductsPerUserFile = path;
                return resolve(path);
            }
        });
    });

    var getUserRatedProductsPromise = new Promise(function (resolve, reject) {
        apiRecommendation.getUserRatedProducts(function (err, path) {
            if (err) {
                console.log("getUserRatedProducts : err    :" + err);
                return reject();
            } else {
                console.log("getUserRatedProducts : success    :" + path);
                userRatedProductsFile = path;
                return resolve(path);
            }
        });
    });

    Promise.all([
        getUserCountPromise,
        getYetToBeRatedProductsPerUserPromise,
        getUserRatedProductsPromise
    ])
        .then(function (values) {
            console.log("\n@@@@@\apiRecommendation.getUserRecommendedProducts :: values:   " + values);

            var options = {
                scriptPath: 'python/scripts',
                args: [userCount, yetToBeRatedProductsPerUserFile, userRatedProductsFile]
            };

            ps.PythonShell.run('hybrid.py', options, function (err, results) {
                if (err) {
                    console.log('apiRecommendation.getUserRecommendedProducts:: error:\n\n %j', err);
                    //res.status(400).send(err);
                    res.status(200).send([]);
                } else {
                    console.log('apiRecommendation.getUserRecommendedProducts:: results:\n\n %j', results);
                    res.status(200).send(results);
                }
            });

        }).catch(err => {
            console.log("\n@@@@@\apiRecommendation.getUserRecommendedProducts :: error: " + err);
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
            console.log("\ngetYetToBeRatedProductsPerUser: uniqueProductIds :   " + uniqueProductIds);

            var query = "SELECT * FROM products WHERE product_id NOT IN (" + uniqueProductIds + ") ORDER BY product_id";
            console.log("getYetToBeRatedProductsPerUser:   query :  " + query);

            apiProducts.getUnEatenProducts(query, function (err, products) {
                if (err) {
                    console.log(err);
                    //res.status(200).send([]);
                    callback(null, []);
                } else {

                    var json = products;
                    var path = './data/yet_to_be_rated_products_per_user_' + user_id + '.csv';

                    jsonexport(products, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log("path:  \n" + csv);
                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            console.log('apiRecommendation.getYetToBeRatedProductsPerUser saved ' + path + "\n\n");

                            //var jsonString = fs.readFileSync(path, 'utf8');
                            //console.log('apiRecommendation.getYetToBeRatedProductsPerUser in csv:\n ' + jsonString + "\n\n");
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

                        if (user.is_veg) {
                            modifiedUser.is_veg = "veg|all";
                        } else {
                            modifiedUser.is_veg = "non_veg";
                        }

                        if (user.is_diabetes) {
                            modifiedUser.is_diabetes = 10;
                        } else {
                            modifiedUser.is_diabetes = 0;
                        }

                        if (user.is_cholestrol) {
                            modifiedUser.is_cholestrol = 20;
                        } else {
                            modifiedUser.is_cholestrol = 0;
                        }
                        usersFormattedArray.push(modifiedUser);
                    }
                    var path = './data/all_users.csv';

                    jsonexport(usersFormattedArray, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log(csv);
                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            console.log('apiRecommendation.getAllUsers saved ' + path + "\n\n");

                            //var jsonString = fs.readFileSync(path, 'utf8');
                            //console.log('apiRecommendation.getAllUsers in csv ' + jsonString + "\n\n");
                        });
                    });

                    callback(null, path);
                }
            });
        }
    });
}

apiRecommendation.getUserRatedProducts = function (callback) {
    var query = "SELECT * FROM rated_orders ORDER BY user_id, product_id, rating";
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

                    jsonexport(ratedOrdersArray, function (err, csv) {
                        if (err) return console.log(err);
                        //console.log(csv);
                        fs.writeFile(path, csv, function (err) {
                            if (err) throw err;
                            console.log('apiRecommendation.getUserRatedProducts saved ' + path + "\n\n");
                            //var jsonString = fs.readFileSync(path, 'utf8');
                            //console.log('apiRecommendation.getUserRatedProducts in csv ' + jsonString + "\n\n");
                        });
                    });

                    callback(null, path);
                }
            });
        }
    });
}

apiRecommendation.getUsersCount = function (callback) {
    var query = "SELECT * FROM users";
    db_pool.connect(function (err, client, done) {
        if (err) {
            callback(err, null);
        } else {
            client.query(query, function (err, result) {
                done();
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result.rows.length);
                }
            });
        }
    });
}

module.exports = apiRecommendation;
