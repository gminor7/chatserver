var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var socket = io('http://'+location.host);

socket.on('connect', function(){
    socket.emit('getRooms',{data:''});
});

socket.on('getRooms', function(data){
    AppActions.addRooms(data);
});

socket.on('enterRoom', function(data){
    AppActions.addMsgs(data);
});

socket.on('sndMsg', function(data){
    AppActions.addMsgs(data);
});

var AppActions = {
  addRooms: function(rooms){
    AppDispatcher.handleViewAction({
      actionType:'ADD_ROOMS',
      rooms: rooms
    })
  },
  addMsgs:function(data){
		AppDispatcher.handleViewAction({
      actionType:'ADD_MSGS',
      data: data
    })
  },
  sndMsg:function(msg) {
    socket.emit('sndMsg',msg);
    //this.addMsgs({msg:msg,room:room});
  },
  enterRoom:function(room,username) {  
    AppDispatcher.handleViewAction({
      actionType:'CHANGE_ROOMS',
      room: room
    });
    socket.emit('enterRoom',{room:room,username:username});
  }
}

module.exports = AppActions
