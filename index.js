var express = require('express');
var app = require('express')();					//express
var http = require('http').Server(app); 		//webserver
var io = require('socket.io').listen(http); 	//socket.io
var Q = require('q');							//q promises
var fs = require('fs');							//node filesystem access
var util = require('util');						//utility for formating messages in node
var bodyParser = require('body-parser');		//body parser for express
var request = require("request");				//request library for making rest calls to rabbitmq	
var shell = require('shelljs');	
var mqtt    = require('mqtt');


var configFile = process.argv[2] || './config.json' ;

if(configFile.indexOf('/')<0) {
	configFile = './'+configFile;
}
if (!fs.existsSync(configFile)) {
   //$log('Unable to find config file. Please make sure it exists.');
   throw('Unable to find config file. Please make sure it exists.');
}

var config = require(configFile);
var port = Number(process.argv[3]) || 3010;


function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

var serverId = generateUUID();
/**
 * Connect to mqtt server and sub to a channel
 * @todo setup chat sync distribution and chat msg distribution
 */
var client  = mqtt.connect(config.mqtt.host);
client.on('connect', function () {
  client.subscribe('chatSync');
  client.publish('chatSync', serverId);
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(topic);
  console.log(message.toString());
  switch(topic) {
  	case 'chatSync': 
  		
  		if(message != serverId) {
  			//save synced data.
  		}
  		break;
	case 'sndMsg':
		var data = JSON.Parse(message); 
		//add message to stack
		if(data.serverId != serverId) {
			var msg = new Msg(data.room);
			msg.send(data.msg);
		}
  		break;
  }
  //client.end();
});


var Weather = require('./api/weather.class.js');

process.on('uncaughtException', function (err) {
	$log('Server Exiting');
	$log(err.stack);
	process.exit(1); 
});

try {
	fs.mkdirSync('./logs/');
} catch(e) {
	//folder exists
}
var log_file = fs.createWriteStream(__dirname + '/logs/server.log', {flags : 'a'}); //logfile for this server
/**
 * Log function that writes out to a log file and to the console.
 * @param  {Object|String} d The error or event to be logged. 
 */
global.$log = function(d) { //
	log_file.write(new Date().toString() + ': ' + util.format(d) + '\n');
	console.log(util.format(d) + '\n');
};


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

/**
 * Build the ui if necessary
 */
if(fs.existsSync('./app/dist')) {
	shell.cd('app');
	shell.exec('gulp;',{silent:true},function(code,output){
	  	$log('ui build complete');
	})
} else {
	shell.cd('app');
	$log('Installing npm packages for the ui.');
	shell.exec('npm install; gulp;',{silent:true},function(code,output){
		//$log('Exit code: '+ code);
	  	$log('Program output: '+ output);
	  	$log('ui build complete');
	})
}
/**
 * serve up the gui under the chat path.
 */
var webdir = __dirname + "/app/dist";
app.use('/chat',express.static(webdir));



var _connections={};
for (var x in config.rooms) {
	_connections[config.rooms[x]] = [];
}
/**
 * Sets up the socket io server and logic for routing messages.
 */
io.on('connection', function(socket){
	//console.log(socket.id);
	socket.on('getRooms', function (data) {
		var rooms = new Rooms();
		socket.emit('getRooms',rooms.get());
		//$log(data);
  	});

  	socket.on('enterRoom', function (data) {
  		var user = new Users(socket.id);
  		user.addAttr('username',data.username);
  		user.addAttr('conn',socket);
  		user.enterRoom(data.room);
  		var msg = new Msg(data.room);
		socket.emit('enterRoom',msg.get());
  	});

  	socket.on('sndMsg', function (data) {
  		console.log(data);
  		var user = new Users(socket.id);
  		var userInfo = user.get();
  		var msg = new Msg(userInfo.room);
  		var output = msg.add(socket.id,data);
  	});

  	socket.on('disconnect', function () {
	    var user = new Users(socket.id);
	    user.delete();
	});
});




http.listen(port, function(){
    $log('listening on *:' + port);
});





/**
 * Start with the room class
 */
var _rooms = {};
for (var x in config.rooms) {
	_rooms[config.rooms[x]] = [];
}

var Rooms = function() {

}

Rooms.prototype.get = function() {
	return Object.keys(_rooms);
}

Rooms.prototype.addUser = function(conn,room) {
	var data = { id: conn.id, conn:conn};
	_rooms[room].push(data);
	return data;
}

Rooms.prototype.removeUser = function(id,room) {
	var i = _rooms[room].length-1;
	while(i>=0) {
		var r = _rooms[room][i];
		if(r.id = id) {
			_rooms[room].splice(i,1);
			return true;
		}
	}
	return false;
}

Rooms.prototype.getUsers = function(room) {
	return _rooms[room];
}

var _msgStore = {};
var tmp = Object.keys(_rooms);
for (var x in tmp) {
	_msgStore[tmp[x]] = [];
}
tmp = null;
if (fs.existsSync(__dirname + '/msgs/msgs.json')) {
	try {
		_msgStore = JSON.parse(fs.readFileSync(__dirname + '/msgs/msgs.json'));
	} catch(e) {
		$log(e);
	}
}

var Msg = function(room) {
	this.room = room;
}

Msg.prototype.get = function() {
	return _msgStore[this.room];
}

Msg.prototype.add = function(userid,msg) {
	if(!userid && !msg) {
		$log('Unable to add msg to store');
	}
	var user = new Users(userid);
	var userInfo = user.get();
	var data = {username:userInfo.username, msg:msg};
	data.ts = new Date().getTime();
	_msgStore[this.room].push(data);
	var i = _msgStore[this.room].length-1;
	while (i>=0) {
		var msg = _msgStore[this.room][i];
		if(msg.ts < data.ts-(5*60*1000)) {
			_msgStore[this.room].splice(i,1);
		}
		i--;
	}
	saveState();
	this.dist(data)
	return data;
}


Msg.prototype.dist = function(data) {
	client.publish('chatSync', JSON.stringify({room:this.room,msg:data,serverId:serverId}));
	this.send(data);
}

Msg.prototype.send = function(data) {
	var room = new Rooms();
	var roomUsers = room.getUsers(this.room);
	for(var x in roomUsers) {
		roomUsers[x].conn.emit('sndMsg',data);
	}
}


var _users = {};

var Users = function(id) {
	this.id = id;
	if(!_users[this.id]) {
		_users[this.id] = {};
	}
}

Users.prototype.addAttr = function(k,v) {
	_users[this.id][k] = v;
}

Users.prototype.get = function() {
	return _users[this.id];
}

Users.prototype.delete = function() {
	if(_users[this.id].room) {
		var room = new Rooms();
		room.removeUser(this.id,_users[this.id].room);
	}
	delete _users[this.id];
	return true;
}

Users.prototype.enterRoom = function(room) {
	var myroom = new Rooms();
	if(_users[this.id].room) {
		myroom.removeUser(this.id,_users[this.id].room);
	}
	_users[this.id].room = room;
	myroom.addUser(_users[this.id].conn,room);
}

var saveState = function() {
	var stateFile = fs.createWriteStream(__dirname + '/msgs/msgs.json');
	stateFile.write(JSON.stringify(_msgStore));
}


