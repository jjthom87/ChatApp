$(document).ready(function(){

		$('#loginForm').on('submit', function(e){
			e.preventDefault();

			fetch('/api/users/login', {
				method: 'post',
				body: JSON.stringify({
					username: $('#usernameInput').val(),
					password: $('#passwordInput').val()
				}),
				headers: {
					'Authorization': 'Basic'+btoa('username:password'),
					'content-type': 'application/json',
					'accept': 'application/json'
				},
				credentials: 'include'
				}).then((response) => {
					if (response.statusText === "OK"){
						localStorage.setItem('token', response.headers.get('Auth'));
						window.location.href = "/chat";
						response.json();
					} else {
						alert ('Incorrect Login Credentials');
					}
				});
		});
});