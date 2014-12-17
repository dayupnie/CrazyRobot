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
		var from = webTools.getDataFromGet(request);
//		console.log(from);
		response.write(query['question']);
		response.end();
	});
}
exports.start = start;