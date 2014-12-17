var fs=require('fs');
var rs = fs.createReadStream("./chat.html");
var chat = require('./chat.cfc.js');
function dealChatMain(request, response){
	chat.start(request,response);
}
function dealChatHtml(request,response){
	response.writeHead(200, { 'Content-Type': 'text/html' });
	rs.on('data', function(data){
		response.write(data);
	});
	rs.on('end',function(){
		response.end();
	});
}
exports.dealChatMain = dealChatMain;
exports.dealChatHtml = dealChatHtml;