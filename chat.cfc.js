var webTools = require("./WebTools");
function start(request, response){
	var querystring = require("querystring");
	response.writeHead(200, {"Content-Type": "text/plain"});
	var postData = '';
	request.addListener('data', function(data){
		postData+=data;
	});
	request.addListener('end', function(){
		var query = querystring.parse(postData);
//		var from = webTools.getDataFromGet(request);
//		console.log(from);
		if(postData == ''){
			response.writeHead(404);
			response.end();
			return;
		}
		startDealData(request,response,query['question']);
	});
}
function startDealData(request,response,question){
	var words=webTools.segmentWords(question,response);
}
exports.start = start;