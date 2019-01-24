"use strict";

var db_pool = require('./../helpers/db');
var apiProducts = {};

apiProducts.getData = function (req, res) {

  db_pool.connect(function(err, client, done) {
       if(err) {
           console.log("#### not able to get connection "+ err);
           res.status(400).send(err);
       }
      var queryCollections = "SELECT * FROM collections";
      var queryProducts = "SELECT * FROM products";
      var queryTrendingProducts = "SELECT * FROM trending_products";
      var queryRecommendedProducts = "SELECT * FROM recommended_products";

      var data = {};
      Promise.all([
              client.query(queryCollections,function(err, result) {
                  done();
                  if(err){
                      console.log(err);
                  } else {
                     data.collections = result.rows;
                   }
              }),
              client.query(queryProducts,function(err, result) {
                  done();
                  if(err){
                      console.log(err);
                  } else {
                     data.products = result.rows;
                   }
              }),
              client.query(queryTrendingProducts,function(err, result) {
                  done();
                  if(err){
                      console.log(err);
                  } else {
                     data.trending_products = result.rows;
                   }
              }),
              client.query(queryRecommendedProducts,function(err, result) {
                  done();
                  if(err){
                      console.log(err);
                  } else {
                     data.recommended_products = result.rows;
                   }
              })
        ])
      .then(function() {
            console.log(data);
            res.status(200).send(data);
      }).catch(err => {
            console.error(err);
            res.status(400).send(err);
      });
    });
},

apiProducts.getCollections = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err) {
           console.log("#### not able to get connection "+ err);
           res.status(400).send(err);
       }

       var query = "SELECT * FROM collections";
       client.query(query,function(err, result) {
          //call `done()` to release the client back to the pool
          console.log("#### getCollections #1");

           done();
           if(err){
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
