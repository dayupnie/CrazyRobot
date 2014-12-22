var net = require("net");
var server = net.createServer(function(conn){
	console.log("connection");
	conn.on("data", function(data){
		console.log(data)
		conn.write("back:"+data)
	});
	conn.write("OK");
});

server.listen(1314, function(){
	console.log("start")
});