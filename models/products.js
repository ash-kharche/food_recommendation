"use strict";

module.exports = function (sequelize, DataTypes) {
    var products = sequelize.define("products", {
        product_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        collection_id: {
            type: DataTypes.INTEGER
        },
        collection_name: {
            type: DataTypes.STRING
        },
        is_veg: {
            type: DataTypes.INTEGER
        },
        rating: {
            type: DataTypes.INTEGER //TODO poonam make Datatype --> REAL/ NUMERIC
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
            insertProduct: function (product_name, image_url, price, collection_id, collection_name, is_veg, rating, callback) {

                var sql = " INSERT INTO products (product_name, image_url, price, collection_id, collection_name, is_veg, rating) VALUES (:product_name, :image_url, :price, :collection_id, :collection_name, :is_veg, :rating)";
                sequelize.query(sql, {replacements: {}}
                ).spread(function (data, metadata) {
                    callback(null, data);
                }).catch(function (err) {
                    callback(err, null);
                });
            }
        }
    });
    return products;
};
