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


      var data = {};
      Promise.all([
                  client.queryAsync(queryCollections)
                  .then(function(rows) {
                    console.log(rows);
                    data.collections = rows;
                  }),
                  client.queryAsync(queryProducts)
                  .then(function(rows){
                    data.products = rows;
                  }),
                  client.queryAsync(queryTrendingProducts)
                  .then(function(rows){
                    data.trending_products = rows;
                  }),
                  client.queryAsync(queryRecommendedProducts)
                  .then(function(rows){
                    data.recommended_products = rows;
                  })
        ])
      .then(function() {
            console.log(data);
            res.status(200).send(JSON.stringify(data));
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
