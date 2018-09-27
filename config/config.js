//postgresql-flat-61884
//laptop postgress password: pass@123
var config = {
    "env": process.env.ENV || "development",
    "production": {
        "sequelize": {
            "username": "vrmqaltlcnstmq",
            "password": "27105cc6facceb06813970ade03639dd337d13066685a238fe776c5415147a62",
            "database": "dcc7k5gq0l7ikv",
            "host": "ec2-174-129-225-9.compute-1.amazonaws.com",
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
