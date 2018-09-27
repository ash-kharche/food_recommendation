"use strict";

var models = require('../models');

var apiUser = {};

apiUser.test = function (req, res) {
    res.send("Hey 123");
}

apiUser.signUpUser = function (req, res) {
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
    var query = {"mobile_number": req.body.mobile_number, "password": req.body.password};
    models.users.findUser().then(function (results) {
        res.json(results);
    });
    models.users.find(query, function (err, results) {
      if (err){
          res.json(err);
      } else {
          res.json(results);
      }

})
}


module.exports = apiUser;
