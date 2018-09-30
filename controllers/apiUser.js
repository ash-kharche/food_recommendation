"use strict";

var models = require('../models');
var db_pool = require('./../helpers/db');
var apiUser = {};

apiUser.test = function (req, res) {
    res.send("Hey! Food Recommendation");
}

apiUser.signUpUser = function (req, res) {
  console.log("Username:  " +req.body.user_name)
    models.users.create({
        user_name: req.body.user_name,
        email: req.body.email,
        mobile_number: req.body.mobile_number,
        password: req.body.password
    }).then(function (err, results) {
        if (err){
          res.json(err);
      } else {
          res.json(results);
      }
    });
}

apiUser.login = function (req, res) {
  console.log("######   LOGIN API   ######");

  db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM users' ,function(err,result) {
          //call `done()` to release the client back to the pool
           done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
}


module.exports = apiUser;
