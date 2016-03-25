var webTools = require('./WebTools');
var chat = require('./chat.cfc');
var botapi = require('./botApi');
var global = require('./global');
var response;
var request;
function receivedHook(request, response){
	global.response = response;
	global.request = request;
	webTools.getDataFromPost(request, response, dealData);
}
function dealData(request, response, responsedata){
	data = JSON.parse(responsedata);
	console.log(data);
	chat.getAnswer(data.message.text, function(code, answer){
		// console.log(data.message.text);
		if(code === global.CODE.GOTTENANSWER){
            
        }
        else if(code === global.CODE.NOANSWER){
            answer = "奥，我暂时回答不了你这个问题，请用“问题～～答案”的形式告诉奴婢好吗～";
        }
        else if(code === global.CODE.HAVEADDED){
            answer = "好的，我知道了～～～";
        }
        else if(code === global.CODE.SOURCEERROR){
            answer = "噢，你在用什么和我聊天呢！！！我才不回答你！！";
        }
        else{
            answer = "奥，我暂时回答不了你这个问题，请用“问题～～答案”的形式告诉奴婢好吗～";
        }
		botapi.sendMessage(data.message.from.id, answer);
	});
	response.end();
}
exports.receivedHook = receivedHook;