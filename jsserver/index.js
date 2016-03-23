/**
 * 程序入口
 * @author KEBE
 */
var server=require("./server");
var fs=require("fs");
global.config = JSON.parse(fs.readFileSync("server.conf","utf-8"));


// fs.readFile("server.conf", 'utf-8', function(error, data){
// 	global.config = data;
// 	console.log(global.config);
// })
/**
 * 开始服务器监听
 */
server.start();
