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
    function segmentWords(words){
    	var Segment = require('node-segment').Segment; 
	// 创建实例 
	var segment = new Segment(); 
	// 使用默认的识别模块及字典 
	segment.useDefault(); 
	return segment.doSegment(words);
}
exports.getClientIp=getClientIp;
exports.segmentWords=segmentWords;
exports.getDataFromGet = getDataFromGet;