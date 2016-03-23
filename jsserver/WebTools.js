var mongoose = require('mongoose');
var querystring = require("querystring");
var conn = mongoose.connect('mongodb://localhost/crazyrobot');
var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;
var Question = new Schema({
    question:{type:String},
    answer:{type:String}
});
var mongo = mongoose.model("queandans",Question);
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

/**
获取POST数据
*/
function getDataFromPost(request, response, callback){
    var postData = '';
    request.addListener('data', function(data){
        postData+=data;
    });
    request.addListener('end', function(){
//      var from = webTools.getDataFromGet(request);
//      console.log(from);
 //       console.log(postData);
        callback(request, response, postData);
    });
}

exports.getClientIp=getClientIp;
exports.getDataFromGet = getDataFromGet;
exports.getDataFromPost = getDataFromPost;
exports.mongo = mongo;