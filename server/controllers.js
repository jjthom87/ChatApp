// DEPENDENCIES
var express = require('express');
var path = require('path');
var _ = require('lodash');

var router = express.Router();

var models = require('../models');

var middleware = require('./middleware.js')();

//home page
router.get('/', (req,res) => {
	res.sendFile(path.join(__dirname, '../client/html/home.html'));
});

//log-in user
router.post('/api/users/login', function (req, res) {
  var body = _.pick(req.body, 'username', 'password');
  var userInfo;

	models.User.authenticate(body).then(function (user) {
	      var token = user.generateToken('authentication');
	      userInfo = user;

	      return models.Token.create({
	        token: token
	      });
	    }).then(function (tokenInstance) {
	      res.header('Auth', tokenInstance.get('token')).json(userInfo.toPublicJSON());
	    }).catch(function () {
	      res.status(401).send();
	});
});

router.get('/createAccount', (req,res) => {
	res.sendFile(path.join(__dirname, '../client/html/createAccount.html'))
});

//create user
router.post('/api/users/create', function(req,res){
    if (req.body.password !== req.body.confirmPassword){
      return reject();
    }
	models.User.create({
	  name: req.body.name,
	  username: req.body.username, 
	  password: req.body.password
	    }).then(function(success) {
	      	res.json(success);
		}).catch(function(err){
			res.json(err);
	});
});

router.get('/chat', (req,res) => {
	res.sendFile(path.join(__dirname, '../client/html/chat.html'))
})

router.get('/api/chat', middleware.requireAuthentication, (req,res) => {
	res.json(req.user.name)
})

//log-out user
router.delete('/api/user/logout', middleware.requireAuthentication, function (req, res) {
  req.token.destroy().then(function () {
    res.status(204).send();
  }).catch(function () {
    res.status(500).send();
  });
});

module.exports = router;
