var app = require('express')();
var http = require('http').createServer(app);
var fs = require('fs');
var path = require('path');
var io = require('socket.io')(http);

app.get('/', function(req,res){
  res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){
	console.log('connected');
	fs.readFile(__dirname+'/image.jpg',function(err,res){
		socket.emit('chunk',Buffer.from(res).toString('base64'));
	});
	socket.on('newImage',function(bytes){
		io.emit('newImage',bytes);
		fs.writeFile(__dirname+'/image.jpg',bytes,'binary',function(err){
			if(err){
				console.log('err: '+err);
			} else{
				console.log('written');
			}
		});
		socket.emit("canClose",1);
	});
});

http.listen(3000, function(){
  console.log('listening on 3000');
});