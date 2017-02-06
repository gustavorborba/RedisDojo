(function(){
  'use strict';

  var socket = io();
  $('#chat_form').submit(function(){
    var message = $('#text').val();
    socket.emit('messages', message);
    $('#text').val('');
    return false;
  });

  socket.on('connect', function(data) {
    $('#status').html('Connected to chat');
    var nickname = prompt("What is your nickname?");
    socket.emit('join', nickname);
  });

  socket.on('message', function(data){
    var msg = JSON.parse(data);
    var mess = '<span>' + msg.name + ': ' + msg.message + '</span>';
    $('#messages').append($('<li>').append(mess));
  });

  socket.on('new', function(msg){
    var message = JSON.parse(msg);
    var asd = '<span>' + message.name + ' se conectou ao chat' +'</span>'
    $('#messages').append($('<li>').append(asd));
  });

})();
