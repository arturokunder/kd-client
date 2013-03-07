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
	
	function _getQuestionVotes_old(pollId, questionId, choiceId, tsStart, tsEnd, callbackSuccess, choice) {
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
	
	function _getDayVotes(pollId, successCallback) {
		return _getPollVotes(2, "day", successCallback);
	}
	
	function _getPollVotes(pollId, granularity, callbackSuccess) {
		return $.ajax({
			url: 		'http://sleepy-river-3269.herokuapp.com/api/stats/datasource/hour'/* + granularity */+ '/' + pollId + '/',
	        type: 		'POST',
	        dataType: 	'json',
	        data: 		{},
	        success: 	function(data) {
	        	callbackSuccess(data);
	        },
	       	error: 		function(jqXHR, textStatus, error) 
			           	{ 
			           		console.log("failed: " + error);
			           	}
		});
	}
	
	function _getQuestionVotes(pollId, questionId, options) {
		var _options = {
			start			: "2013-01-01 00:00:00",
			end 			: $.DateTimeFormatter.Now(),
			granularity 	: "month",
			pollId			: pollId,
			questionId 		: questionId,
			callbackSuccess : function(options) { console.log("Ajax success. No success function."); },
			callbackError	: function(jqXHR, textStatus, error, options) { console.log("failed: " + error); },
		};
		
		_options = $.extend(_options, options);
		
		return $.ajax({
			url		: 'http://sleepy-river-3269.herokuapp.com/api/stats/datasource/' 
				+ _options.granularity + '/' + _options.pollId + '/' + _options.questionId + '/',
			type	: 		'POST',
	        dataType: 	'json',
	        data	: 		{
	        	ts_start	: _options.start,
	        	ts_end		: _options.end,
	        },
	        success	: function(data) {
	        	_options.data = data;
	        	_options.callbackSuccess(_options);
	        },
	        error: function(jqXHR, textStatus, error) {
	        	_options.callbackError(jqXHR, textStatus, error, _options);
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
		getQuestionVotes	: _getQuestionVotes,
		getDayVotes			: _getDayVotes,
		
		getQuestionVotes_old : _getQuestionVotes_old,
		
		GenerateTokenData 	: _generateTokenData,
	};
}(jQuery));