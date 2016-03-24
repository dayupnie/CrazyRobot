var request = require('request');
var $ = require('jquery'); 
var baikeBaseUrl = 'http://baike.baidu.com/search/word?word=';
function getAnswerFromBaike(question, callback){
    request.get({
        url:baikeBaseUrl+question+"",
        timeout:10000
    }, function(err,httpResponse, body){
        console.log($(body).find("div"));
    });
}
getAnswerFromBaike("qq");
