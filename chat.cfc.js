var webTools = require("./WebTools");
var segment = require("nodejieba");
var global = require('./global');
segment.loadDict("./node_modules/nodejieba/dict/jieba.dict.utf8", "./node_modules/nodejieba/dict/hmm_model.utf8");
//segment.load_userdict("./")
var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") ;
function segmentWords(request, response, words){
  	var w = words.replace(pattern, "");		//replace special words from data
	segment.cut(w, function(wordList) {
	  	var wl = {};
	  	var i = 0;
		wordList.forEach(function(word) {	//segment the words
				wl[i++]=word;
			});
		getAnswerFromDatabase(wl);	//
	});
}
function getAnswerFromDatabase(words){
	console.log(words);
}
function start(request, response){
	var querystring = require("querystring");
	response.writeHead(200, {"Content-Type": "text/plain"});
	var postData = '';
	request.addListener('data', function(data){
		postData+=data;
	});
	request.addListener('end', function(){
//		var from = webTools.getDataFromGet(request);
//		console.log(from);
		if(postData == ''){		//if there is no POST data, return 404 page.
			response.writeHead(404);
			response.end();
			return;
		}
		var query = querystring.parse(postData);
		if(query['question'].indexOf(";and;and")>0)
		{

		}
		else
		{
			segmentWords(request, response, query['question']);
		}
	});
}
exports.start = start;