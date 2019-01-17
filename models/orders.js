"use strict";

module.exports = function (sequelize, DataTypes) {
    var orders = sequelize.define("orders", {
        order_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.STRING,
            allowNull: false
        },
        order_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
        }

    }, {
        classMethods: {
            insertOrder: function (date, total_amount, order_address, callback) {

                var sql = " INSERT INTO orders (date, total_amount, order_address) VALUES (:date, :total_amount, :order_address)";
                sequelize.query(sql, {replacements: {}}
                ).spread(function (data, metadata) {
                    callback(null, data);
                }).catch(function (err) {
                    callback(err, null);
                });
            }
        }
    });
    return orders;
};
