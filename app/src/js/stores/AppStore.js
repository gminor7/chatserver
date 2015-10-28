var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var CHANGE_ROOM_EVENT = 'change_rooms'

var _rooms = {};
var _msgs = [];
var AppStore = assign({}, EventEmitter.prototype, {
	getRooms: function() {
    	return _rooms;
	},
	getMsgs: function(){
		return _msgs;
	},
	addMsgs: function(data){
		if(data.constructor === Array) {
			_msgs  = _msgs.concat(data);
		} else {
			_msgs.push(data);
		}
		this.emitChange();
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	emitRooms: function() {
		this.emit(CHANGE_ROOM_EVENT);
	},
	addChangeListener: function(callback) {
	    this.on(CHANGE_EVENT, callback);  
	},
	addRoomChangeListener: function(callback) {
		this.on(CHANGE_ROOM_EVENT, callback);  
	},
	addRooms: function(data) {
		_rooms = data;
		//console.log(_rooms);
		this.emitRooms();
	},
	changeRooms: function() {
		_msgs = [];
		this.emitChange();
	}
});

AppDispatcher.register(function(data){
	switch(data.action.actionType) {
		case 'ADD_ROOMS' :
			AppStore.addRooms(data.action.rooms);
			break;
		case 'ADD_MSGS' :
			AppStore.addMsgs(data.action.data);
			break;
		case 'CHANGE_ROOMS' :
			AppStore.changeRooms();
			break;
	}
  	return true;
});

module.exports = AppStore;


