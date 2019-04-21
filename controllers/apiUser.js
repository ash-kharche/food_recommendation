"use strict";

var db_pool = require('./../helpers/db');
var apiUser = {};

apiUser.login = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            res.status(400).send(err);
        }

        var query = "SELECT * FROM users WHERE (email = $1 OR user_name = $1 OR mobile_number = $1)AND password = $2";
        client.query(query, [req.body.email, req.body.password], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send("Oops! Invalid Login.");

            } else {
                res.status(200).send(result.rows[0]);
            }
        });
    });
}

apiUser.signUpUser = function (req, res) {

    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var query = "INSERT INTO users (user_name, email, mobile_number, password)  VALUES ($1, $2, $3, $4)  RETURNING *";
        client.query(query, [req.body.user_name, req.body.email, req.body.mobile_number, req.body.password], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.status(200).send(result.rows[0]);
            }
        });
    });
}

apiUser.getUser = function (req, res) {
    db_pool.connect(function (err, client, done) {
        if (err) {
            res.status(400).send(err);
        }
        var query = "SELECT * FROM users WHERE user_id = $1";
        client.query(query, [req.params.user_id], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);

            } else {
                res.status(200).send(result.rows);
            }
        });
    });
}

apiUser.submitAnswers = function (req, res) {
    console.log("submitAnswers: user_id:  " + req.body.user_id);

    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        } else {
            var query = "UPDATE users SET " +
                " is_veg = " + req.body.is_veg +
                ", is_diabetes = " + req.body.is_diabetes +
                ", is_cholestrol = " + req.body.is_cholestrol +
                ", is_kid = " + req.body.is_kid +
                ", is_senior = " + req.body.is_senior +
                ", is_question_done = " + req.body.is_question_done +
                " WHERE user_id = " + req.body.user_id + " RETURNING * ";

            console.log("@@@@@@submitAnswers\n\n" + query + "\n");
            client.query(query, function (err, result) {

                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                } else {
                    console.log("submitAnswers:  " + result.rows[0]);
                    res.status(200).send(result.rows[0]);
                }
            });
        }
    });
}


module.exports = apiUser;
