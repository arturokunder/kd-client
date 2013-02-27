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
	
	function _getQuestionVotes(pollId, questionId, choiceId, tsStart, tsEnd, callbackSuccess, choice) {
		var deferred = $.Deferred();
		
		$.ajax({
			url: 		'http://sleepy-river-3269.herokuapp.com/api/stats/' + pollId + '/',
	        type: 		'POST',
	        dataType: 	'json',
	        data: 		$.extend({
	        				question_id : questionId,
	        				choice_id : choiceId,
	        				ts_start : "2013-01-01 00:00:00",
	        				ts_end : $.DateTimeFormatter.Now(),
	        			}, _generateTokenData()),
	        success: 	function(data) {
	        	callbackSuccess(data, questionId, choice, deferred);
	        },
	       	error: 		function(jqXHR, textStatus, error) 
			           	{ 
			           		console.log("failed: " + error);
			           		deferred.reject();
			           	}
	    });
		
		return deferred.promise();
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
		getQuestionVotes	: _getQuestionVotes,
	};
}(jQuery));