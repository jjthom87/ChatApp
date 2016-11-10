var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var clientInfo = {};

var moment = require('moment');

var bodyParser = require('body-parser');

var routes = require('./controllers.js');
var middleware = require('./middleware.js')();

var models = require('../models');
models.sequelize.sync();

app.use(express.static('client'));
app.use('/static', express.static('client'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use('/', routes);
//sends current users to provided socket
function sendCurrentUsers (socket){
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined'){
		return;
		//for rooms that dont exist
	}

	//takes an object and returns an array of all attributs on object
	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room){
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().format('MMM Do YYYY @ h:mm a')
	});
}

io.on('connection', function (socket) {
	console.log('User connected via socket.io');

	socket.on('disconnect', function(){
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefined'){
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left',
				timestamp: moment().format('MMM Do YYYY @ h:mm a')
			});
			delete userData;
		}
	});
	socket.on('joinRoom', function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message',{
			name: 'System',
			text: req.name + ' has joined',
			timestamp: moment().format('MMM Do YYYY @ h:mm a')
		});
	});

	socket.on('message', function(message){
		//@private
		if (message.text === '@currentUsers'){
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().format('MMM Do YYYY @ h:mm a')
			io.to(clientInfo[socket.id].room).emit('message', message);
		//below sends to every person but the sender
		// socket.broadcast.emit('message', message);
		}
	});
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat',
		timestamp: moment().format('MMM Do YYYY @ h:mm a')
	});
});

app.post('/api/message', middleware.requireAuthentication, function(req, res){
	models.Message.create({
		message: req.body.message,
		usersName: req.user.name,
		createdOn: moment().format('MMM Do YYYY @ h:mm a')
		}).then(function(message){
	      req.user.addMessage(message).then(function(success){
	    	res.json(message);
		  }).catch(function(err){
		    res.json(err);
		  });
	});
});

app.get('/api/messages', middleware.requireAuthentication, function(req,res){
	models.Message.findAll({order: 'createdAt ASC'}).then(function(messages){
		res.json(messages);
	});
});

app.post('/api/like', middleware.requireAuthentication, function(req, res){
	models.Like.create({
		like: false,
		usersName: req.user.name,
		createdOn: moment().format('MMM Do YYYY @ h:mm a'),
		MessageId: req.body.MessageId,
		UserId: req.body.UserId
		}).then(function(like){
	      req.user.addLike(like).then(function(success){
	    	res.json(like);
		  }).catch(function(err){
		    res.json(err);
		  });
	});
});

// app.put('/api/like/:id', middleware.requireAuthentication, function(req,res){
// 	  models.Mission.findOne({ where: { uuid: uuid}}).then(function(missiontask){
// 	        missiontask.set('isCompleted', true);
// 	        missiontask.save();
// 	          res.json(missiontask);
// 	      }).catch(function(err){
// 	        throw err
// 	   		})	
// });

var PORT = process.env.PORT || 8000;

http.listen(PORT, function (){
	console.log('Listening on Port ' + PORT);
});