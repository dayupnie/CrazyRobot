var mysql = require('mysql');
var webTools = require('./WebTools');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database:'CrazyRobot',
    port: 3306
});
conn.connect();
conn.query('select * from robot', function(err, rows, fields) {
    if (err) throw err
    var mongo = new webTools.mongo();
    mongo.question = "KEBE";
    mongo.answer = "KEBE，一只程序猿。。。";
    mongo.save(function(a){
        console.log(a);
    })
});
conn.end();