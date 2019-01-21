/*
"username": "vrmqaltlcnstmq",
"password": "27105cc6facceb06813970ade03639dd337d13066685a238fe776c5415147a62",
"database": "dcc7k5gq0l7ikv",
"host": "ec2-174-129-225-9.compute-1.amazonaws.com",
*/
//laptop postgress password: pass@123
var config = {
    "env": process.env.ENV || "production",
    "production": {
        "sequelize": {
            "username": "uvzjkvhjhvrevn",
            "password": "e9fa122e883f4af209c53c4586f1e7d2e38fee3495a03873c0191b98cea73fb2",
            "database": "de7pit5nq8p35l",
            "host": "ec2-54-243-223-245.compute-1.amazonaws.com",
            "port": 5432,
            "dialect": "postgres",
            "dialectOptions": {
                "multipleStatements": true
            },
            "logging": false,
            "define": {
                "timestamps": true,
                "underscored": true
            }
        }
    },
    "development": {
        "sequelize": {
            "username": "postgres",
            "password": "pass@123",
            "database": "db_food_reco",
            "host": "localhost",
            "port": 5432,
            "dialect": "postgres",
            "dialectOptions": {
                "multipleStatements": true
            },
            "logging": false,
            "define": {
                "timestamps": true,
                "underscored": true
            }
        }
    }

};

module.exports = config;
