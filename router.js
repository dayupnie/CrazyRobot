var deal=require('./dealMain');
var url = require('url');
function route(resquest, response){
	var handle={};
	handle['/chat.cfc']=deal.dealChatMain;
	handle['/chat.html']=deal.dealChatHtml;
	var path=url.parse(resquest.url).pathname;
	if(typeof handle[path] === 'function')
	{
		console.log(path+" is dealing...")
		handle[path](resquest, response);
	}
	else
	{
		response.writeHead(404);
		response.end();
	}
}
exports.route = route;