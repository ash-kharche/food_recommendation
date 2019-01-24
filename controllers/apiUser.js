"use strict";

var db_pool = require('./../helpers/db');
var apiUser = {};

apiUser.signUpUser = function (req, res) {
  console.log("Username:  " +req.body.user_name)

db_pool.connect(function(err, client, done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       }


  //Currently password is same as 'mobile_number'
  var query = "INSERT INTO users (user_name, email, mobile_number, password)  VALUES ($1, $2, $3, $4)";
  client.query(query, [ req.body.name, req.body.email, req.body.mobile_number, req.body.mobile_number] ,function(err,result) {
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
  console.log("######   LOGIN API   ###### user_name:  " + req.body.email + " and password: " + req.body.password);

  db_pool.connect(function(err, client, done) {
       if(err){
           console.log("#### not able to get connection "+ err);
           res.status(400).send(err);
       }

       var query = "SELECT * FROM users WHERE email = $1 AND password = $2";
       client.query(query, [req.body.email, req.body.password] ,function(err, result) {
          //call `done()` to release the client back to the pool
           done();
           if(err){
               console.log(err);
               res.status(400).send(err);

           } else {
              console.log("### Login successful");

              //start update login status
              var query = "UPDATE users SET status = 0 WHERE email = $1";
              client.query(query, [req.body.email] ,function(err, result) {
                 //call `done()` to release the client back to the pool
                  done();
                  if(err){
                      console.log(err);
                      res.status(400).send(err);

                  } else {
                     console.log("### Login successful");
                     res.status(200).send(result.rows);
                   }
              });
              //end update login status
              res.status(200).send(result.rows);
            }
       });
    });
}

apiUser.logout = function (req, res) {
  console.log("######   LOGOUT API   ###### user_name:  " + req.body.email);

  db_pool.connect(function(err, client, done) {
       if(err){
           console.log("#### not able to get connection "+ err);
           res.status(400).send(err);
       }
       var query = "UPDATE users SET status = 0 WHERE email = $1";
       client.query(query, [req.body.email] ,function(err, result) {
           done();
           if(err){
               console.log(err);
               res.status(400).send(err);

           } else {
              console.log("### Login successful");
              res.status(200).send(result.rows);
            }
       });
    });
}

apiUser.getAllUsers = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err){
           res.status(400).send(err);
       }
       var query = "SELECT * FROM users";
       client.query(query,function(err, result) {
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

apiUser.getUser = function (req, res) {
  db_pool.connect(function(err, client, done) {
       if(err) {
           res.status(400).send(err);
       }
       var query = "SELECT * FROM users WHERE user_id = $1";
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
}


module.exports = apiUser;
