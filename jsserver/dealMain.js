var fs=require('fs');
var rs = fs.createReadStream("./chat.html");
var chat = require('./chat.cfc');
var bot = require('./bot');
var html = "";
/**
 * 读取HTML文件内容，程序启动时直接读取，为了更加快速
 */
rs.on('data', function(data){
    //异步读取文件
    html+=data;
});
rs.on('end',function(){
    //读取文件结束
});
/**
 * 开始处理请求
 * @param request
 * @param response
 */
function dealChatMain(request, response){
	chat.start(request,response);
}
/**
 * 返回HTML
 * @param request
 * @param response
 */
function dealChatHtml(request,response){
	response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(html);
    response.end();
}

function receivedHook(request, response){
	bot.receivedHook(request, response);
}

exports.dealChatMain = dealChatMain;
exports.dealChatHtml = dealChatHtml;
exports.receivedHook = receivedHook;