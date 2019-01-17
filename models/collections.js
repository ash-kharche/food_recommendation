"use strict";

module.exports = function (sequelize, DataTypes) {
    var collections = sequelize.define("collections", {
        collection_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        collection_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        products: {
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
            insertCollection: function (name, image_url, products, callback) {

                var sql = " INSERT INTO collections (ame, image_url, products) VALUES (:ame, :image_url, :products)";
                sequelize.query(sql, {replacements: {}}
                ).spread(function (data, metadata) {
                    callback(null, data);
                }).catch(function (err) {
                    callback(err, null);
                });
            }
        }
    });
    return collections;
};
