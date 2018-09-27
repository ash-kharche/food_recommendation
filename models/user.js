"use strict";

module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define("users", {
        user_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        classMethods: {
            insert_user: function (user_name, password, callback) {
                
                var sql = " INSERT INTO users (user_name, password) VALUES (:user_name, :password)";
                sequelize.query(sql, {replacements: {}}
                ).spread(function (data, metadata) {
                    callback(null, data);
                }).catch(function (err) {
                    callback(err, null);
                });
            }
        }
    });
    return users;
};
