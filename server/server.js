var http = require("http");
var router = require('./router');
var server = http.createServer(function(request, response){
	router.route(request, response);
});
var net = require("net");
var server1 = net.createServer(function(conn){
    console.log("connection");
    conn.on("data", function(data){
        console.log(data.toString());
        conn.write("back:"+data);
    });
    conn.write("OK");
});

server1.listen(2222, function(){
    console.log("start");
});
exports.start=function(){
    server.listen(8888);
}