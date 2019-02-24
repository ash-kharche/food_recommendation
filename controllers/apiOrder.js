"use strict";

var db_pool = require('./../helpers/db');
var apiOrder = {};

apiOrder.placeOrder = function (req, res) {
db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }


  var query = "INSERT INTO orders (user_id, payment_mode, total_amount, order_address, products, date)  VALUES ($1, $2, $3, $4, $5)";
  client.query(query, [req.body.user_id, req.body.payment_mode, req.body.total_amount, req.body.order_address, req.body.products, new Date()] ,function(err,result) {
           done();
           if(err) {
               console.log(err);
               res.status(400).send(err);
           } else {
               res.status(200).send(result.rows);
          }
       });
    });
},

apiOrder.getOrderDetails = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err) {
           res.status(400).send(err);
       }
       var query = "SELECT * FROM orders WHERE user_id = $1 AND order_id = $2";
       client.query(query, [req.params.user_id, req.params.order_id] ,function(err, result) {
          done();
           if(err){
               console.log(err);
               res.status(400).send(err);

           } else {
              res.status(200).send(result.rows);
            }
       });
    });
},

apiOrder.getAllOrders = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err) {
           res.status(400).send(err);
       }
       var query = "SELECT * FROM orders WHERE user_id = $1";
       client.query(query, [req.params.user_id] ,function(err, result) {
          done();
           if(err){
               console.log(err);
               res.status(400).send(err);

           } else {
              res.status(200).send(result.rows);
            }
       });
    });
},

apiOrder.rateProductPerOrder = function (req, res) {
  console.log("Order:  " +req.body.order_id + "   Product:  " +req.body.product_id+"   Rating:   " +req.body.rating )

db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }

  var query = "UPDATE orders (rating)  VALUES ($1) WHERE (order_id = " + req.body.order_id + " AND " + " product_id = " + req.body.product_id +")";
  client.query(query, [ req.body.rating] ,function(err,result) {
           done();
            if(err) {
               console.log(err);
               res.status(400).send(err);
            } else if(rows != undefined) {
                res.status(200).send("Product rating saved for  Order:  " +req.body.order_id + "   Product:  " +req.body.product_id+"   Rating:   " +req.body.rating);
            } else {
              res.status(200).send(result.rows);
            }
       });
    });
}

module.exports = apiOrder;
