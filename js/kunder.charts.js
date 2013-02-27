jQuery.Charts = (function($) {
	
	const seriesColors = ['#195895', '#11AC3A', '#E62F17', '#E69117', 
	                      '#619FDB', '#5AE37E', '#F67362', '#F6BA62',
	                      '#052B50', '#035C1B', '#7B1204', '#7B4B04'
	                      ]; 
	
	function _drawDashboardQuestionChart(question, dataTable) {
		var options = {
				'title' 		: question.question,
				'titleTextStyle': {
									'fontSize' : 14,
								  }, 
				'width' 		: 350,
				'height'		: 250,
				'colors'		: seriesColors,
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
		
		var pieChart = new google.visualization.PieChart($('#chart-' + question.id + "-pie")[0]);
		pieChart.draw(dataTable, options);
		
		options.legend.position = 'none';
		
		var barChart = new google.visualization.BarChart($('#chart-' + question.id + "-bar")[0]);
		barChart.draw(dataTable, options);
		
		var columnChart = new google.visualization.ColumnChart($('#chart-' + question.id + "-column")[0]);
		columnChart.draw(dataTable, options);
		
		//$('.dashboardQuestion').hide();
	}
	
	return {
		DrawDashboardQuestionChart	: _drawDashboardQuestionChart,
	};
}(jQuery));