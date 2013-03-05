jQuery.Storage = (function($) {
	
	function _setLoginParams(user, pass) {
		window.localStorage.setItem("user", user);
		window.localStorage.setItem("pass", pass);
	}
	
	function _getUser() {
		return window.localStorage.getItem("user");

	}
	
	function _getPassword() {
		return window.localStorage.getItem("pass");
	}
	
	
	function _setQuestions(pollId, data) {
		var old = _getQuestions(pollId);
		var json = JSON.stringify(data);
		
		if(old != null && old == json) {
			return;
		}
		else {
			window.localStorage.setItem("poll-" + pollId, json);
			$(document).trigger('questionsChanged', []);
		}
	}
	
	function _getQuestions(pollId) {
		return  window.localStorage.getItem("poll-" + pollId);
	}
	
	function _getQuestion(pollId, questionId) {
		var questions = JSON.parse(_getQuestions(pollId)).questions;
		var question = null;
		$.each(questions, function(i, item) {
			if(item.id == questionId) {
				question = item;
			}
		});
		
		return question;
	}
	
	return {
		setLoginParams	: _setLoginParams,
		
		getUser			: _getUser,
		getPassword		: _getPassword,
		
		setQuestions	: _setQuestions,
		getQuestions	: _getQuestions,
		
		getQuestion 	: _getQuestion,
	};
}(jQuery));
