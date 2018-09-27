"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");

var config = require(__dirname + '/../config/config.js');
var config_sequelize = config[config.env]['sequelize'];
var env = config[config.env];
console.log("\nDatabase Connection String=>" + JSON.stringify(config_sequelize)+"\n");
var sequelize = new Sequelize(config_sequelize.database, config_sequelize.username, config_sequelize.password, config_sequelize);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
module.exports.env = env;

