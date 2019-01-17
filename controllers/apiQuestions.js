"use strict";

var db_pool = require('./../helpers/db');
var apiQuestions = {};

apiUser.submitAnswers = function (req, res) {
db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }


  var query = "INSERT INTO answers ()  VALUES ($1, $2, $3)";
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
module.exports = apiQuestions;
