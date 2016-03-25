var request = require('request');


function sendMessage(chat_id, text, parse_mode){
	parse_mode = 'HTML';
	// console.log(global.config);
	console.log('http://teleapi.crazyforcode.org/bot'
		+global.config.telegrambottoken+"/sendMessage?"
		+"chat_id="+chat_id+"&text="+text);

	request.post({url:'http://teleapi.crazyforcode.org/bot'
		+global.config.telegrambottoken+"/sendMessage"
		// +"chat_id="+chat_id+"&text="+text
		, 
			form:{chat_id:chat_id,
				text:text,
				parse_mode:parse_mode},
		}, function(err, httpResponse, body){
			console.log(body);
		});
}


exports.sendMessage = sendMessage;