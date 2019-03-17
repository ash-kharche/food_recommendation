var jsonexport = require('jsonexport');
const fs = require('fs');
var path = require('path');

var contacts = [{
    name: 'Bob',
    lastname: 'Smith'
}, {
    name: 'James',
    lastname: 'David'
}, {
    name: 'Robert',
    lastname: 'Miller'
}, {
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

jsonexport(contacts, function (err, csv) {
    if (err) return console.log(err);
    console.log(csv);
    var user_id = 13;
    var path = './data/user_' + user_id + '.csv';

    fs.writeFile(path, csv, function (err) {
        if (err) throw err;
        console.log('file saved  ' + path+"\n");

        var jsonPath = path.join(__dirname, '..', 'data', 'user_12.json');
        var jsonString = fs.readFileSync(jsonPath, 'utf8');
        console.log('jsonString  ' + jsonString+"\n");

        // Prints: /Users/mjr
//var absolutePath = path.resolve(path);
//console.log('file saved:  absolutePath  ' + absolutePath);
    });

    /*if (fs.existsSync(path)) {
        fs.unlink(path, function (err, result) {
            if (err) throw err;
            fs.writeFile(path, csv, function (err) {
                if (err) throw err;
                console.log('file saved');
            });
        });
    }*/
});
