var webTools = require('./WebTools');
var chat = require('./chat.cfc');
var botapi = require('./botApi');
var response;
var request;
function receivedHook(request, response){
	global.response = response;
	global.request = request;
	webTools.getDataFromPost(request, response, dealData);
}
function dealData(request, response, responsedata){
	data = JSON.parse(responsedata);
	// console.log(data);
	chat.getAnswer(data.message.text, function(code, answer){
		// console.log(data.message.text);
		botapi.sendMessage(data.message.chat.id, answer);
	});
	response.end();
}
exports.receivedHook = receivedHook;