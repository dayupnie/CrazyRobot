var webTools = require("./WebTools");
var segment = require("nodejieba");
var global = require('./global');
var exec = require('child_process').exec; 

segment.queryLoadDict("./node_modules/nodejieba/dict/jieba.dict.utf8", "./node_modules/nodejieba/dict/hmm_model.utf8");
//segment.load_userdict("./")
/**
 * 正则过滤字符
 * @type {RegExp}
 */
var pattern = new RegExp(/[！￥……（）——【】；：。，、]/g);
/**
 * 分词
 * @param request
 * @param response
 * @param words
 */
function segmentWords(words, callback){
  	var w = words.replace(pattern, "");		//replace special words from data
    w = w.replace(/;and/g,"&");
  	//console.log(segment);
  	segment.queryCut(w, function(wordList) {
       // console.log(wordList);
		getAnswerFromDatabase(wordList, callback);
	});
}
/**
 * 从数据库读取数据
 * @param response
 * @param words
 */
function getAnswerFromDatabase(words, callback){
    var wlength = words.length;
    var id=[];
    var tmp = 0;
    var tmp1 = 0;
    var id_length = words.length;
    for(var i = 0; i< wlength; i++){
        if(words[i] === ' ')
        {
            id_length--;
            continue;
        }
        webTools.mongo.find({question:{$regex:'.*'+words[i]+'.*'}},function(err,docs){
            tmp1++;
            if(err){
                // response.write('{"result":'+global.CODE.RUNTIMEERROR+'}');
                // response.end();
                callback(global.CODE.RUNTIMEERROR);
            }
            else{
                for(var j = 0; j<docs.length; j++){
                    id[tmp++]=docs[j]._id;
                }
            }
            if(tmp1 === id_length){
                doLastWork(id,id_length, callback);
            }
        });
    }
}

function getAnswer(words, callback){

        var tag =0;
        if(words.indexOf("~~")>0){
            tag = 1;
        };
        if(words.indexOf("～～")>0){
            tag = 2;
        };
        if(tag!=0){
            if(tag == 1)
                var info = words.split("~~");
            else
                var info = words.split("～～");
            if(info.length > 2){
                callback(global.CODE.NOANSWER);
            }
            else{
                var queandans = {};
                var insert = new webTools.mongo();
                insert.question = info[0];
                insert.answer = info[1];
                insert.save(function(err){
                    if(err) {
                        callback(global.CODE.RUNTIMEERROR);
                    }
                    else{
                        callback(global.CODE.HAVEADDED);
                    }
                });
            }
            return;
        }

    if(words == '成绩'){
        exec("python /home/{user}/workspace/CQUTStudentScoreSubscribeSystem/src/GetScore.py 1130307xxxx xxxxxxxx 1502345xxxx x", function(err,stdout,stderr){
            text = "";
            if(err){
                text = "未查询到成绩！";
                callback(global.CODE.NOANSWER, text);
            }
            else{
                data = JSON.parse(stdout);
                for(var i = 0; i<data.length; i++){
                    text+="名字：<b>"+data[i].name+"</b>\n";
                    text+="分数：<b>"+data[i].score+"</b>\n";
                    text+="学分：<b>"+data[i].credit+"</b>\n";
                    text+="\n"
                }
            }
            callback(global.CODE.GOTTENANSWER, text);
        });
    }
    else{
        segmentWords(words, callback);
    }
}

function findBestAnswerId(id){
    id.sort();
    var tmp = id[0];
    var idS = [];
    var max = 1;
    var n = 1;
    var k = 0;
    var saveId = tmp;
    for(var i = 1; i<id.length; i++){
        if(id[i].toString() == tmp.toString()){
            n++;
        }
        else{
            if(n>max)
            {
                max = n;
                saveId = id[i-1];
            }
            n = 1;
            tmp = id[i];
        }
    }
    n=1;
    tmp = id[0];
    idS[k++] = saveId;
    for(var i = 1; i<id.length; i++){
        if(id[i].toString() == tmp.toString()){
            n++;
        }
        else{
            if(n == max && saveId != id[i-1])
            {
                idS[k++]=id[i-1];
            }
            n = 1;
            tmp = id[i];
        }
    }
    if(n == max && saveId != id[i-1])
    {
        idS[k++]=id[i-1];
    }
    if(n>max)
    {
        max = n;
        saveId = id[i-1];
    }
    var result = {};
    if(idS.length > 1){
        saveId = idS[Math.ceil(Math.random()*idS.length)-1];
    }
    result['id']=saveId;
    result['count'] = max;
    return result;
}

function doLastWork(id,id_length, callback){
    if(id.length == 0){
        callback(global.CODE.RUNTIMEERROR);
        return;
    }
    var result = findBestAnswerId(id);
    if(result['count']<id_length/2.0){
        callback(global.CODE.NOANSWER);
        return;
    }
    else{
        webTools.mongo.find({_id:result['id']},function(err,answer){
            if(err) {
                callback(global.CODE.RUNTIMEERROR);
            }
            else{
                callback(global.CODE.GOTTENANSWER, answer[0].answer);
            }
        })
    }
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
			getAnswer(query['question'], function(code, result){
                response.write('{"result":'+code+',"data":"'+result+'"}');
                response.end();
            });
	});
}
exports.start = start;
exports.getAnswer = getAnswer;
