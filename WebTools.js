  var mongodb =require('mongodb');
  var server = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect:true});
  var db = new mongodb.Db('crazyrobot', server, {safe:true});
function connectMongoDB(){
  db.open(function(err, db){
  if(!err){
    db.createCollection('queandans', {safe:true}, function(err, connection){
      if (err) {
        console.log(err);
      }
      else{
        return connection;
      }
    });
  }else{
  console.log(err);
  }
  });
}
function getDataFromGet(request){
  var url = require('url');
  var queryString = require("querystring");
  var getData = url.parse(request.url,true).query;
  var getData1 = queryString.parse(getData);
  return getData1;
}
function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;
}



exports.getClientIp=getClientIp;
exports.getDataFromGet = getDataFromGet;