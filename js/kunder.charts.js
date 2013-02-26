jQuery.Charts = (function($) {
	
	function _drawDashboardChart(question, dataTable) {
		
		var div = $('#chart-' + question.id);
		var options = {
				'title' 		: question.question,
				'titleTextStyle': {
									'fontSize' : 14,
								  }, 
				'width' 		: 350,
				'height'		: 250,
				'legend'		: {
									'position' : 'right',
									'alignment': 'center',
									'textStyle': {
													'fontSize' : 12,
												 },
								  },
				'backgroundColor': 'transparent',
				'tooltip' 		: { 
									'showColorCode' : true,
									'textStyle': {
													'fontSize' : 12,
												 },
								  },
				
		};
		var chart = new google.visualization.PieChart(div[0]);
		chart.draw(dataTable, options);
	}
	
	return {
		DrawDashboardChart	: _drawDashboardChart,
	};
}(jQuery));