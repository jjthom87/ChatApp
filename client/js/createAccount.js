$(document).ready(function(){

		$('#createAccountForm').on('submit', function(e){
			e.preventDefault();

			var password = $('#createPasswordInput').val();
			var confirmPassword = $('#confirmPasswordInput').val();

			if (password !== confirmPassword){
				alert('Passwords dont match');
				$('#createPasswordInput').val(''),
				$('#confirmPasswordInput').val('')
			}

			fetch('/api/users/create', {
				method: 'post',
				body: JSON.stringify({
					name: $('#createNameInput').val(),
					username: $('#createUsernameInput').val(),
					password: $('#createPasswordInput').val(),
					confirmPassword: $('#confirmPasswordInput').val()
				}),
				headers: {
					'content-type': 'application/json',
					'accept': 'application/json'
				},
				credentials: 'include'
				}).then((response) => response.json())
					.then((results) => {
					if (results.createdAt){
						window.location.href ='/';
					} 
					if (results.errors[0].message === 'username must be unique'){
						alert('Username Already Taken');
						$('createUsernameInput').val('');
					}
				});
		});
});