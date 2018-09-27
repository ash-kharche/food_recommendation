"use strict";

var models = require('../models');

var apiUser = {};

apiUser.test = function (req, res) {
    res.send("Hey! Food Recommendation");
}

apiUser.signUpUser = function (req, res) {
  console.log("User_name:  " +req.body.user_name);
    models.users.insertUser({
        req.body.user_name,
        req.body.email,
        req.body.mobile_number,
        req.body.password
    }).then(function (err, results) {
        if (err){
          res.json(err);
      } else {
          res.json(results);
      }
    });
}

apiUser.login = function (req, res) {
    var query = {"mobile_number": req.body.mobile_number, "password": req.body.password};
    models.users.find(query, function (err, results) {
      if (err){
          res.json(err);
      } else {
          res.json(results);
      }
    });
}


module.exports = apiUser;
