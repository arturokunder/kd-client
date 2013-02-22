jQuery.Login = (function($) {

	function _login() {
		
		var user = $.Storage.getUser();
		var pass = $.Storage.getPassword();
		
		$.when(_getLoginState(user, pass))
		.then( 
			function() { 
				window.location.href = "dashboard.htm";
			}, 
			function() { 
				window.location.href = "login.htm";
			});
	}
	
	function _getLoginState(user, pass) {
		
		var deferred = $.Deferred();
		
		$.ajax({
            url: 		'http://sleepy-river-3269.herokuapp.com/api/poll/2/',
            type: 		'POST',
            dataType: 	'json',
            data: 		$.Server.GenerateTokenData(user, pass),
            success: 	function(data) {
            	if(data.id) {
            		deferred.resolve();
            	}
            	else {
            		deferred.reject();
            	}
            },
            error: 		function(jqXHR, textStatus, error) {
            	console.log("ajax error");
            	deferred.reject();
            }
        });
		
		return deferred.promise();
	}
	
	
	
	return {
		Login: _login,
	};
}(jQuery));