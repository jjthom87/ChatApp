$(document).ready(function(){
	var socket = io();
	var usersName;

	socket.on('connect', function(){
		console.log('Connected to socket.io server!');

		socket.emit('joinRoom', {
			name: usersName,
		});
	});

	fetch('/api/chat', {
		headers: {
            Auth: localStorage.getItem('token'),
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        credentials: 'include'
		}).then((response) => response.json())
		.then((results) => {
			usersName = results;
			$('#loginUserName').append(results);
		});

		fetch ('/api/messages', {
			headers: {
				Auth: localStorage.getItem('token'),
	            'content-type': 'application/json',
	            'accept': 'application/json'
			},
			credentials: 'include'
		}).then((response) => response.json())
		.then((results) => {
			results.forEach(function(message){
				var theMessage = $('<div>');

				theMessage.append('<p><strong>' + message.usersName + ': ' + message.message + '</strong>' + ' - ' + message.createdOn + ' ' + '<button id="' + message.id + message.UserId + '"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" id="x"></span></button></p>');
				$('.messages').append(theMessage);

					$('#' + message.id + message.UserId).on('click', function(){
						fetch('/api/like', {
							method: 'post',
							body: JSON.stringify({
								UserId: message.UserId,
								MessageId: message.id,
								message: message.message
							}),
							headers: {
				                Auth: localStorage.getItem('token'),
				                'content-type': 'application/json',
				                'accept': 'application/json'
			            	},
			            	credentials: 'include'
			            	}).then((response) => response.json())
							.then((results) => {
								console.log(results)
							});
					})
				});

		});

		$('#logout').on('submit', function(e){
			e.preventDefault();
			
			fetch('/api/user/logout', {
				method: 'delete',
				headers: {
					Auth: localStorage.getItem('token'),
				},
				credentials: 'include'
			}).then((results) => {
				window.location.href = "/";
			});
		});

		var picDiv = $('<div>');
		var pic = $('<img id="happy">');
		pic.attr('src', './Happy_face.jpg').height(65).width(65)
		picDiv.append(pic);
		$('.images').append(picDiv);

		$('#happy').on('click', function(){
			$('#inputMessage').val('Happy-Face');
		})

		$('#message-form').on('submit', function(e){
			e.preventDefault();

			socket.emit('message', {
				name: usersName,
				text: $('#inputMessage').val()
			});
			fetch('/api/message', {
				method: 'post',
	            body: JSON.stringify({
	            	message: $('#inputMessage').val()
	            }),
	            headers: {
	                Auth: localStorage.getItem('token'),
	                'content-type': 'application/json',
	                'accept': 'application/json'
	            },
	            credentials: 'include'
				}).then((response) => response.json())
					.then((results) => {
					});

			$('#inputMessage').val('');
		});

		socket.on('message', function(message){
			if (message.text.indexOf('Happy-Face') > -1){
				console.log('yay')
			}
			var timeStamp = message.timestamp;
			var messages = $('.messages');
			var theMessage = $('<div>');
			if (message.name === 'System'){
				theMessage.append('<p><strong>' + message.name + ': ' + message.text + '</strong>' + ' - ' + message.timestamp + '</p>');
				messages.append(theMessage);
			} else {
			theMessage.append('<p><strong>' + message.name + ': ' + message.text + '</strong>' + ' - ' + message.timestamp + ' ' + '<button id="' + message.name + message.UserId + '"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true" id="x"></span></button></p>');
			messages.append(theMessage);
			}
		});

});

