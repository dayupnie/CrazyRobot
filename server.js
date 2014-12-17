var http=require("http");
var router=require('./router');
var server = http.createServer(function(request, response){
	router.route(request, response);
});
exports.start=function(){
	server.listen(8888);
}