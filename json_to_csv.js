//https://github.com/zeMirco/json2csv

/*
//Try 1
const fs = require('fs');
var json2csv = require('json2csv');

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

json2csv({data: json, fields: ['car', 'price', 'color']}, function(err, csv) {
  if (err) console.log(err);
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
});


//Try 2
const json2csv = require('json2csv').parse;
const fields = ['car', 'price', 'color'];
const opts = { fields };
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
try {
  const csv = json2csv(json, opts);
  console.log(csv);
} catch (err) {
  console.error(err);
}
*/

//Try 1
const fs = require('fs');
const json2csv = require('json2csv').parse;
const fields = ['car', 'price', 'color'];
const opts = { fields };
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

try {
  const csv = json2csv(json, opts);
  console.log(csv);
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
} catch (err) {
  console.error(err);
}
