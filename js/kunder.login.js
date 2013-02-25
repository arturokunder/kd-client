jQuery.Login = (function($) {

	function _login() {
		
		$.when(_getLoginState())
		.then( 
			function() { 
				window.location.href = "dashboard.htm";
			}, 
			function() { 
				showLogin(true);
			});
	}
	
	function _getLoginState() {
		
		var deferred = $.Deferred();
		
		$.ajax({
            url: 		'http://sleepy-river-3269.herokuapp.com/api/poll/2/',
            type: 		'POST',
            dataType: 	'json',
            data: 		$.Server.GenerateTokenData(),
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