var db_pool = require('./../helpers/db');
var jsonexport = require('jsonexport');
const fs = require('fs');

var jsonToCsv = {};

jsonToCsv.convertJsonToCsv = function (req, res) {

    db_pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var query = "SELECT * FROM products LIMIT 5";
        client.query(query, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                console.log("Products:   " + result.rows);

                var json = result.rows;

                var user_id = 12;
                var path = './data/user_' + user_id + '.csv';

                jsonexport(json, function (err, csv) {
                    if (err) return console.log(err);
                    console.log(csv);
                    fs.writeFile(path, csv, function (err) {
                        if (err) throw err;
                        console.log('file saved ' + path+ "\n\n");

                        var jsonString = fs.readFileSync(path, 'utf8');
                        console.log('jsonString ' + jsonString+ "\n\n");
                    });
                });

                res.status(200).send(result.rows);
            }
        });
    });
}
module.exports = jsonToCsv;

/*
var contacts = [{
    name: 'Bob',
    lastname: 'Smith'
},{
    name: 'James',
    lastname: 'David'
},{
    name: 'Robert',
    lastname: 'Miller'
},{
    name: 'David',
    lastname: 'Martin'
}];

var json = [
  {
    "car": "Audi",
    "price": 40000,
    "color": "blue"
  }, {
    "car": "BMW",
    "price": 35000,
    "color": "black"
  }, {
    "car": "Porsche",
    "price": 60000,
    "color": "green"
  }
];

jsonexport(json,function(err, csv){
    if(err) return console.log(err);
    console.log(csv);
    fs.writeFile('file_export.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
});
*/
