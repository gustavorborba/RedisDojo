var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

var redis = require("redis");
var sub = redis.createClient();
var pub = redis.createClient();
pub.auth("");
sub.auth("");

  io.on('connection', function(socket){
    sub.subscribe('message', 'new');

    socket.on('join', function(name) {

      socket.nickname = name;
      var reply = JSON.stringify({
        name : socket.nickname,
        logDate : new Date()
      });
      pub.lrange('message', 0, -1, function (error, data) {
        data.forEach(function(reply, i ){
          socket.send(reply);
        });
      });
      pub.publish('new', reply);
    });

    socket.on('messages', function(message){
      var reply = JSON.stringify({
        name : socket.nickname,
        message : message,
        mesDate : new Date()
      });
      pub.rpush('message', reply);
      pub.publish('message', reply);
    });

    sub.on('message', function(channel,message){
      socket.emit(channel, message);
    });
});
app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.use(express.static('../public'));

server.listen(8080,function(){
  console.log("Server listening...");
});
