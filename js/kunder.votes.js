jQuery.Votes = (function($) {

	function _getDashboardData() {
		$.Server.getPollQuestions(2, _getQuestionSuccessCallback);
		$.Server.getDayVotes(2, _getDayVotesSuccessCallback);
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
				
				ajaxs[j] = $.Server.getQuestionVotes_old(
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
	
	function _getDayVotesSuccessCallback(dayData) {
		var data = new google.visualization.DataTable(dayData);
		
		//TODO: timezone offset
//		var timezone = new Date().getTimezoneOffset() / -60;
//		console.log(timezone);
//		var formatter = new google.visualization.DateFormat({'timeZone' : timezone});
//    	formatter.format(data, 0);
		
    	$.Charts.DrawDashboardDayVotes(data);
		
	}
	
	function _createDayVotesDataTable() {
		var data = new google.visualization.DataTable();
		
		data.addColumn('string', 'Hora');
		data.addColumn('number', 'Cantidad');
		
		var d = new Date();
		var h = d.getHours();
		
		for(var i = 0; i < 24; i++) {
			var votes = i < h ? Math.floor((Math.random()*100)+1) : 0;
			data.addRow([i + ':00', votes]);
		}
		
		$.Charts.DrawDashboardDayVotes(data);
	}
	
	function _getWeeklyVotes() {
		_createWeeklyVotesDataTable();
	}
	
	function _createWeeklyVotesDataTable() {
		var data = new google.visualization.DataTable();
		
		data.addColumn('string', 'Semana');
		data.addColumn('number', 'Cantidad');
		
		for(var i = 1; i <= 52; i++) {
			var votes = Math.floor((Math.random()*100)+1);
			data.addRow([i.toString(), votes]);
		}
		
		$.Charts.DrawDashboardWeeklyVotes(data);
	}
	
	return {
		getDashboardData: 	_getDashboardData,
	};
}(jQuery));