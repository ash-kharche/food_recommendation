"use strict";
var db_pool = require('./../helpers/db');
var spawn = require("child_process").spawn;
var runPython = {};

runPython.test = function (req, res) {
    var process = spawn('python',["./python/hello.py"]);
    process.stdout.on('data', function(data) {
          console.log("hello ...");
          res.send(data.toString());
    })
},

runPython.getTrendingProducts = function (callback) {
  console.log("\nrunPython: getTrendingProducts");
    var process = spawn('python',["./python/trending_products.py"]);
    process.stdout.on('data', function(data) {
          if(data) {
              callback(null, data);
          } else {
              callback(new Error("No Trending products available"), null);
          }
    })
},

runPython.getRecommendedProducts = function (callback) {
  console.log("\nrunPython: getRecommendedProducts");
    var process = spawn('python',["./python/recommendation.py"]);
    /*process.stdout.on('data', function(data) {
          if(data) {
              console.log("runPython: recommendation");
              callback(null, data);
          }
    })*/

    db_pool.connect(function(err, client, done) {
         if(err) {
             res.status(400).send(err);
         } else {
         var query = "SELECT * FROM orders WHERE user_id = 5";
         client.query(query, function(err, result) {
            done();
             if(err) {
                 console.log(err);
                 res.status(400).send(err);

             } else {
                //res.status(200).send(result.rows[0]);

                console.log("\n\n\n\n^^^^^^^^^\n ");

                console.log("\n\n&&&&&&&&&&&&&&&\ngetRecommendedProducts \n " +result.rows);
                console.log("\n\n&&&&&&&&&&&&&&&\ngetRecommendedProducts \n " +result.rows[0].products);
                console.log("\n\n&&&&&&&&&&&&&&&\ngetRecommendedProducts \n " +result.rows[0].products[0]);
                console.log("\n\n&&&&&&&&&&&&&&&\ngetRecommendedProducts \n " +result.rows[0].products[0].product_id);


                /*for (var i in result.rows) {
                  var orderObject = result.rows[i];
                  console.log("\n\n****************\ngetRecommendedProducts \n " +orderObject);

                  console.log("\n\n$$$$$$$$$$$\ngetRecommendedProducts \n " +orderObject.products);

                }*/


              }
         });
       }
      });
},

runPython.getCartRecommendedProducts = function (callback) {
  console.log("\nrunPython: getCartRecommendedProducts");
    var process = spawn('python',["./python/cart_recommendation.py"]);
    process.stdout.on('data', function(data) {
          console.log("runPython: cart_recommendation");
          callback(null, data);
    })
}

module.exports = runPython;
