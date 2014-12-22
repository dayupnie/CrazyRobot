var webTools = require("./WebTools");
var segment = require("nodejieba");
var global = require('./global');
segment.queryLoadDict("./node_modules/nodejieba/dict/jieba.dict.utf8", "./node_modules/nodejieba/dict/hmm_model.utf8");
//segment.load_userdict("./")
var pattern = new RegExp(/[！￥……（）——【】；：。，、？]/g);
function segmentWords(request, response, words){
  	var w = words.replace(pattern, "");		//replace special words from data
  	//console.log(segment);
  	segment.queryCut(w, function(wordList) {
	  	var wl = {};
	  	var i = 0;
		wordList.forEach(function(word) {	//segment the words
				wl[i++]=word;
			});
		var result = getAnswerFromDatabase(wl);	//
        response.write('{"result":'+global.CODE.GOTTENANSWER+',"data":"Test answer"}');
        response.end();
	});
}
function getAnswerFromDatabase(words){
    webTools.mongo.find(function(err,docs){
        console.log(docs);
    })
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
 //       console.log(postData);
		if(postData == ''){		//if there is no POST data, return 404 page.
			response.writeHead(404);
			response.end();
			return;
		}
		var query = querystring.parse(postData);
		if(query['question'].indexOf(";and;and")>0)
		{
            response.writeHead(200);
            response.write('{"result":'+global.CODE.HAVEADDED+'}');
            response.end();
		}
		else
		{
			segmentWords(request, response, query['question']);
		}
	});
}
exports.start = start;