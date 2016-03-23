/**
 * 路由设置，程序开始时设定
 * @type {exports}
 */
var deal=require('./dealMain');
var url = require('url');
function route(resquest, response){
	var handle={};
    /**
     * 要监听的Url
     * @type {dealChatMain}
     */
	handle['/chat.cfc']=deal.dealChatMain;
	handle['/chat.html']=deal.dealChatHtml;
	handle['/']=deal.receivedHook;

	var path=url.parse(resquest.url).pathname;
	console.log(path+" is dealing...");
	
	if(typeof handle[path] === 'function')
	{
        //设置相应的handle
		handle[path](resquest, response);
	}
	else
	{
        //如果页面不存在，返回404
		response.writeHead(404);
		response.end();
	}
}
exports.route = route;