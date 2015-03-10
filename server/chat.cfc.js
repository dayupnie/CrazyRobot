var webTools = require("./WebTools");
var segment = require("nodejieba");
var global = require('./global');
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
function segmentWords(request, response, words){
  	var w = words.replace(pattern, "");		//replace special words from data
    w = w.replace(/;and/g,"&");
  	//console.log(segment);
  	segment.queryCut(w, function(wordList) {
       // console.log(wordList);
		getAnswerFromDatabase(response,wordList);
	});
}
/**
 * 从数据库读取数据
 * @param response
 * @param words
 */
function getAnswerFromDatabase(response,words){
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
                response.write('{"result":'+global.CODE.RUNTIMEERROR+'}');
                response.end();
            }
            else{
                for(var j = 0; j<docs.length; j++){
                    id[tmp++]=docs[j]._id;
                }
            }
            if(tmp1 === id_length){
                doLastWork(response,id,id_length);
            }
        });
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
function doLastWork(response,id,id_length){
    if(id.length == 0){
        response.write('{"result":'+global.CODE.NOANSWER+'}');
        response.end();
        return;
    }
    var result = findBestAnswerId(id);
    if(result['count']<id_length/2.0){
        response.write('{"result":'+global.CODE.NOANSWER+'}');
        response.end();
        return;
    }
    else{
        webTools.mongo.find({_id:result['id']},function(err,answer){
            if(err) {
                response.write('{"result":' + global.CODE.RUNTIMEERROR + '}');
                response.end();
            }
            else{
                response.write('{"result":'+global.CODE.GOTTENANSWER+',"data":"'+answer[0].answer+'"}');
                response.end();
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
        var tag =0;
        if(query['question'].indexOf("~~")>0){
            tag = 1;
        };
        if(query['question'].indexOf("～～")>0){
            tag = 2;
        };
        if(tag!=0)
		{
            if(tag == 1)
                var info = query['question'].split("~~");
            else
                var info = query['question'].split("～～");
            if(info.length > 2){
                response.writeHead(200);
                response.write('{"result":'+global.CODE.NOANSWER+'}');
                response.end();
            }
            else{
                var queandans = {};
                var insert = new webTools.mongo();
                insert.question = info[0];
                insert.answer = info[1];
                insert.save(function(err){
                    if(err) {
                        response.writeHead(200);
                        response.write('{"result":' + global.CODE.RUNTIMEERROR + '}');
                        response.end();
                    }
                    else{
                        response.writeHead(200);
                        response.write('{"result":'+global.CODE.HAVEADDED+'}');
                        response.end();
                    }
                });
            }
		}
		else
		{
			segmentWords(request, response, query['question']);
		}
	});
}
exports.start = start;