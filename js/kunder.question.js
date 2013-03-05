jQuery.Question = (function($) {
	
	function _showChoices(questionId) {
		var question = $.Storage.getQuestion(2, questionId);
		
		if(question != null) {
			var choices = $.Sorter.SortAsc(question.choices, "id");
			$.each(choices, function(i, item) {
				var div = $('<div>').append(
						$('<input>')
							.attr('type', 'checkbox')
							.attr('checked', 'checked')
							.attr('value', item.id)
						).append(item.text);
				$('#choices').append(div);
			});
		}
	}
	
	function _generateChart(pollId, questionId, options) {
		var _options = {
//				choices 	: choices,
//				granularity : granularity,
//				start		: start,
//				end			: end,
//				chartType	: "",
				callbackSuccess	: $.Charts.DrawQuestionChart,
				chartOptions 	: {},
		};
		
		_options = $.extend(_options, options);
		
		$.Server.getQuestionVotes(pollId, questionId, _options);
	}
	
	return {
		ShowChoices 	: _showChoices,
		GenerateChart 	: _generateChart,
	};
}(jQuery));