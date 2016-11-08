var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');

var routes = require('controllers.js')

var models = require('../models');
models.sequelize.sync();

app.use(express.static('../client'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use('/', routes);

var PORT = process.env.PORT || 8000;

http.listen(PORT, function (){
	console.log('Listening on Port ' + PORT);
});