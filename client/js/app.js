$(document).ready(function(){
	fetch('/api/chat', {
		headers: {
            Auth: localStorage.getItem('token'),
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        credentials: 'include'
		}).then((response) => response.json())
		.then((results) => {
			$('#loginUserName').append(results);
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
				console.log(results);
				window.location.href = "/";
			});
		});
});

