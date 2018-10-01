"use strict";

var db_pool = require('./../helpers/db');
var apiProducts = {};

apiProducts.getAllProducts = function (req, res) {

  db_pool.connect(function(err, client, done) {
       if(err){
           console.log("#### not able to get connection "+ err);
           res.status(400).send(err);
       } 

       var query = "SELECT * FROM products";
       client.query(query,function(err, result) {
          //call `done()` to release the client back to the pool
           done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);

           } else {
              res.status(200).send(result.rows);
            }
       });
    });
}

apiProducts.getCollections = function (req, res) {

  db_pool.connect(function(err, client, done) {
       if(err){
           console.log("#### not able to get connection "+ err);
           res.status(400).send(err);
       } 

       var query = "SELECT * FROM collections";
       client.query(query,function(err, result) {
          //call `done()` to release the client back to the pool
           done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);

           } else {
              res.status(200).send(result.rows);
            }
       });
    });
}


module.exports = apiProducts;
