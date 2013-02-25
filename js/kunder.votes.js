jQuery.Votes = (function($) {

	function _getDashboardData() {
		$.Server.getPollQuestions(2, _getQuestionSuccessCallback);
	}
	
	function _getQuestionSuccessCallback(data) {
		console.log(JSON.stringify(data));
		
		data.questions = $.Sorter.SortAsc(data.questions, "order");
		
		$.each(data.questions, function(i, item) {
			var question = [];
			
			question.pollId = data.id;
			question.id = data.questions[i].id;
			question.question = data.questions[i].question;
			
			question.choices = new Array();
			
			var template = Handlebars.getTemplate("dashboardQuestion");
			$('#questions').append(template({question : question}));
			
			var ajaxs = new Array();
			
			$.each(data.questions[i].choices, function(j, jtem) {
				data.questions[i].choices = $.Sorter.SortAsc(data.questions[i].choices, "id");
				
				question.choices[j] = [];
				question.choices[j].id = data.questions[i].choices[j].id;
				question.choices[j].text = data.questions[i].choices[j].text;
				
				ajaxs[j] = _getVotes(
						question.pollId, 
						question.id, 
						question.choices[j].id, 
						"", 
						"", 
						_getVotesCallbackSuccess,
						question.choices[j]
					);
			});
			
			$.when.apply($, ajaxs)
			.then(function() { 
				_createDataTable(question);
			});
		});
	}
	
	function _createDataTable(question) {
		var data = new google.visualization.DataTable();
		
		data.addColumn('string', 'Opciones');
		data.addColumn('number', 'Cantidad');
		
		$.each(question.choices, function(i, item) {
			data.addRow([question.choices[i].text, parseInt(question.choices[i].votes)]);
		});
		
		var options = {};
		var chart = new google.visualization.PieChart($('#chart-' + question.id)[0]);
		chart.draw(data, options);
	}
	
	function _getVotes(pollId, questionId, choiceId, tsStart, tsEnd, callbackSuccess, choice) {
		var deferred = $.Deferred();
		
		$.ajax({
			url: 		'http://sleepy-river-3269.herokuapp.com/api/stats/' + pollId + '/',
	        type: 		'POST',
	        dataType: 	'json',
	        data: 		$.extend({
	        				question_id : questionId,
	        				choice_id : choiceId,
	        				ts_start : "2013-01-01 00:00:00",
	        				ts_end : "2013-12-31 00:00:00"
	        			}, $.Server.GenerateTokenData()),
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
	
	function _getVotesCallbackSuccess(data, questionId, choice, deferred) {
		choice.votes = data.count;
		deferred.resolve();
	}
	
	return {
		getDashboardData: 	_getDashboardData,
		getVotes: _getVotes,
	};
}(jQuery));