"use strict";

var db_pool = require('./../helpers/db');
var apiProducts = {};

apiProducts.getData = function (req, res) {

  db_pool.connect(function(err, client, done) {
       if(err) {
           console.log("#### not able to get connection "+ err);
           res.status(400).send(err);
       }

       /* FETCH Single Query results
       var query = "SELECT * FROM collections";

       client.query(query,function(err, result) {
          //call `done()` to release the client back to the pool
           done();
           if(err){
               console.log(err);
               res.status(400).send(err);

           } else {
              //res.status(200).send(result.rows);
              var data = {};
              data.collections = result.rows;
              res.status(200).send(JSON.stringify(data));
            }
       });*/

      //PROMISE start
      var queryCollections = "SELECT * FROM collections";
      var queryProducts = "SELECT * FROM products";
      var queryTrendingProducts = "SELECT * FROM trending_products";
      var queryRecommendedProducts = "SELECT * FROM recommended_products";

      /*Promise.all([
        queryWrapper(queryCollections),
        queryWrapper(queryProducts),
        queryWrapper(queryTrendingProducts),
        queryWrapper(queryRecommendedProducts)
    ])*/
    Promise.all([
      queryCollections,
      queryProducts,
      queryTrendingProducts,
      queryRecommendedProducts
  ])
    .then(([collections, products, trending_products, recommended_products]) => {
      var data = {};
      data.collections = collections;
      data.products = products;
      data.trending_products = trending_products;
      data.recommended_products = recommended_products;

      res.status(200).send(JSON.stringify(data));

    })
    .catch(err => {
        console.error(err);
        res.redirect('/');
    })
      //PROMISE end

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
