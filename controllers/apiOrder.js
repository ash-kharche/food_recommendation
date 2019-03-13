"use strict";

var db_pool = require('./../helpers/db');
var apiProducts = require('./../controllers/apiProducts');
var apiOrder = {};

apiOrder.placeOrder = function (req, res) {
db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }

       //console.log("#### ORDER API::     " + JSON.stringify(req.body.products));

    var query = "INSERT INTO orders (date, total_amount, order_address, payment_mode, products, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    client.query(query, [new Date(), req.body.total_amount, req.body.order_address, req.body.payment_mode, JSON.stringify(req.body.products), req.body.user_id] ,

    function(err,result) {
           done();
           if(err) {
               console.log(err);
               res.status(400).send(err);
           } else {
               console.log("$$$$$$ Place Order:   " + result.rows[0] );
               res.status(200).send(result.rows[0]);
          }
       });
    });
},

apiOrder.getOrderDetails = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err) {
           res.status(400).send(err);
       } else {
       var query = "SELECT * FROM orders WHERE user_id = $1 AND order_id = $2";
       client.query(query, [req.params.user_id, req.params.order_id] ,function(err, result) {
          done();
           if(err) {
               console.log(err);
               res.status(400).send(err);

           } else {
              res.status(200).send(result.rows[0]);
            }
       });
     }
    });
},

apiOrder.getAllOrders = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err) {
           res.status(400).send(err);
       } else {

         console.log("$$$$$$\ngetAllOrders:  req.body.user_id  " + req.params.user_id);

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
     }
    });
},

apiOrder.rateOrder = function (req, res) {
  console.log("Order:  " +req.body.order_id + "   Product:  " +req.body.product_id+"   Rating:   " +req.body.rating )

db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }

  var query = "UPDATE orders SET rating = " + req.body.rating + " WHERE (order_id = " + req.body.order_id + " AND " + " product_id = " + req.body.product_id +")";
  client.query(query,function(err,result) {
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
},

apiOrder.rateProductPerOrder = function (req, res) {
  console.log("Order:  " +req.body.order_id + "   Product:  " +req.body.product_id+"   Rating:   " +req.body.rating )

db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }

  var query = "UPDATE orders SET rating = " + req.body.rating + " WHERE (order_id = " + req.body.order_id + " AND " + " product_id = " + req.body.product_id +")";
  client.query(query, function(err,result) {
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
