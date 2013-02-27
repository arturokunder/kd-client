jQuery.Votes = (function($) {

	function _getDashboardData() {
		$.Server.getPollQuestions(2, _getQuestionSuccessCallback);
	}
	
	function _getQuestionSuccessCallback(data) {
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
				
				ajaxs[j] = $.Server.getQuestionVotes(
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
				_createQuestionDataTable(question);
			});
		});
	}
	
	function _createQuestionDataTable(question) {
		var data = new google.visualization.DataTable();
		
		data.addColumn('string', 'Opciones');
		data.addColumn('number', 'Cantidad');
		
		$.each(question.choices, function(i, item) {
			data.addRow([question.choices[i].text, parseInt(question.choices[i].votes)]);
		});
		
		$.Charts.DrawDashboardQuestionChart(question, data);
		$(document).trigger('pageLoaded', []);
	}
	
	function _getVotesCallbackSuccess(data, questionId, choice, deferred) {
		choice.votes = data.count;
		deferred.resolve();
	}
	
	return {
		getDashboardData: 	_getDashboardData,
	};
}(jQuery));