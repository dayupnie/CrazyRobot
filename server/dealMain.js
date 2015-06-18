var fs=require('fs');
var rs = fs.createReadStream("./chat.html");
var chat = require('./chat.cfc');
var html = "";
rs.on('data', function(data){
    html+=data;
});
rs.on('end',function(){
});
function dealChatMain(request, response){
	chat.start(request,response);
}
function dealChatHtml(request,response){
	response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(html);
    response.end();
}
exports.dealChatMain = dealChatMain;
exports.dealChatHtml = dealChatHtml;