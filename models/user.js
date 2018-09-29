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
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
        }

    }, {
        classMethods: {
            insertUser: function (user_name, email, mobile_number, password, callback) {
                
                var sql = " INSERT INTO users (user_name, email, mobile_number, password) VALUES (:user_name, :email, :mobile_number, :password)";
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
