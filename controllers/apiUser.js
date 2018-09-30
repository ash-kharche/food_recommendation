"use strict";

var models = require('../models');
var db_pool = require('./../helpers/db');
var apiUser = {};

apiUser.test = function (req, res) {
    res.send("Hey! Food Recommendation");
}

apiUser.signUpUser = function (req, res) {
  console.log("Username:  " +req.body.user_name)

db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 

       
  var query = "INSERT INTO users (user_name, email, mobile_number, password)  VALUES ($1, $2, $3, $4)";
  client.query(query, [ req.body.user_name, req.body.email, req.body.mobile_number, req.body.password) ,function(err,result) {
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

apiUser.login = function (req, res) {
  console.log("######   LOGIN API   ######" + req.body.mobile_number + "  " + req.body.password);

  db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 

       var query = "SELECT * FROM users WHERE mobile_number = $1 AND password = $2";
       client.query(query, [req.body.mobile_number, req.body.password] ,function(err,result) {
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
