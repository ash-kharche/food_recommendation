"use strict";

var db_pool = require('./../helpers/db');
var apiProducts = require('./../controllers/apiProducts');
var apiOrder = {};

apiOrder.placeOrder = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        //console.log("#### ORDER API::     " + JSON.stringify(req.body.products));

        var query = "INSERT INTO orders (date, total_amount, order_address, payment_mode, products, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
        client.query(query, [new Date(), req.body.total_amount, req.body.order_address, req.body.payment_mode, JSON.stringify(req.body.products), req.body.user_id],

            function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                } else {
                    console.log("$$$$$$ Place Order:   " + result.rows[0]);
                    res.status(200).send(result.rows[0]);
                }
            });
    });
}

apiOrder.rateOrder = function (req, res) {
    var user_id = req.body.user_id;
    var order_id = req.body.order_id;
    var productsArray = req.body.products;

    for (var i = 0; i < productsArray.length; i++) {
        var product = productsArray[i];
        apiOrder.rateProductPerOrder(user_id, order_id, product.product_id, product.rating);
    }

    res.status(200).send({});
}

apiOrder.getAllOrders = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            res.status(400).send(err);
        } else {

            console.log("$$$$$$\ngetAllOrders:  req.body.user_id  " + req.params.user_id);

            var query = "SELECT * FROM orders WHERE user_id = $1 ORDER BY order_id DESC";
            client.query(query, [req.params.user_id], function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);

                } else {
                    res.status(200).send(result.rows);
                }
            });
        }
    });
}

apiOrder.getOrderDetails = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            res.status(400).send(err);
        } else {
            var query = "SELECT * FROM orders WHERE user_id = $1 AND order_id = $2";
            client.query(query, [req.params.user_id, req.params.order_id], function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);

                } else {
                    res.status(200).send(result.rows[0]);
                }
            });
        }
    });
}

apiOrder.rateProductPerOrder = function (user_id, order_id, product_id, rating) { //callback
    console.log("Order:  " + order_id + "   Product:  " + product_id + "   Rating:   " + rating)

    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            //res.status(400).send(err);
        }

        var query = "INSERT INTO rated_orders (user_id, order_id, product_id, rating)  VALUES ($1, $2, $3, $4)  RETURNING *";
        client.query(query, [user_id, order_id, product_id, rating], function (err, result) {
            done();
            if (err) {
                console.log(err);
                //callback(err, null);
            } else {
                apiProducts.updateProductRating(product_id, rating, function (err, rating) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("rateProductPerOrder: updateProductRating " + rating);
                        console.log(result.rows);
                    }
                });
            }
        });
    });
}

module.exports = apiOrder;
