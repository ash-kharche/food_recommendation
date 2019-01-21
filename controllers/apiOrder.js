"use strict";

var db_pool = require('./../helpers/db');
var apiOrder = {};

apiOrder.insertOrder = function (req, res) {
db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }


  var query = "INSERT INTO orders (date, total_amount, order_address)  VALUES ($1, $2, $3)";
  client.query(query, [ req.body.date, req.body.total_amount, req.body.order_address] ,function(err,result) {
           done();
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
}

apiOrder.getOrderDetails = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err) {
           res.status(400).send(err);
       }
       var query = "SELECT * FROM orders WHERE order_id = $1";
       client.query(query, [req.params.order_id] ,function(err, result) {
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

module.exports = apiOrder;
