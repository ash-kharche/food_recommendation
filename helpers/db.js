"use strict";
var pg = require('pg');
var config = require('./config/config');
var env = config[config.env];
var config_params = {
    user: env.sequelize.username,
    password: env.sequelize.password,
    database: env.sequelize.database,
    port: env.sequelize.port,
    host: env.sequelize.host,
    ssl: false,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}
const db = new pg.Pool(config_params);
db.connect(function (err, client, done) {
    if (err) {
        console.log("Database error: " + err.message);
    } else {
        console.log("Database connected: " + client);
    }

});

module.exports = db;
