"use strict";

var models = require('../models');

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

    //var query = {"mobile_number": req.body.mobile_number, "password": req.body.password};
    var query = {"mobile_number": '9029799650', "password": 'poonam'};
    
    models.users.findOne({where: query }).then(err, results) {
      console.log("######   FIND QUERY   ######");
      if (err){
          res.json(err);
      } else {
          res.json(results);
      }
    });
}


module.exports = apiUser;
