jQuery.Server = (function($) {

	function _getPollQuestions(pollId, callbackSuccess) {
		$.ajax({
            url: 		'http://sleepy-river-3269.herokuapp.com/api/poll/' + pollId + '/',
            type: 		'POST',
            dataType: 	'json',
            data: 		_generateTokenData(),
            success: 	function(data) {
            	$.Storage.setQuestions(pollId, data);
            	callbackSuccess(data);
            },
            error: 		function(jqXHR, textStatus, error) {
            	console.log("ajax error");
            }
        });
	}
	
	function _generateTokenData() {
		
		// user: usuario del sistema
		// key: private key del user
		// date: fecha UTC con formato: 0000-00-00 00:00:00
		var user = $.Storage.getUser();
		var pass = $.Storage.getPassword();
       	var date = $.DateTimeFormatter.Now();
		
       	// token: Hmac-SHA1 en Base64 usando la key y date+user
		var token = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(date + user, pass));
		
		return { 	
				date 		: date, 
				username 	: user, 
				token 		: token
			};
	}
	
	return {
		getPollQuestions	: _getPollQuestions,
		GenerateTokenData	: _generateTokenData,
	};
}(jQuery));