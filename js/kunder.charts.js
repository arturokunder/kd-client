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
		$('#chart-' + question.id + "-pie").removeClass("chartLoading");
		
		options.legend.position = 'none';
		
		var barChart = new google.visualization.BarChart($('#chart-' + question.id + "-bar")[0]);
		barChart.draw(dataTable, options);
		$('#chart-' + question.id + "-bar").removeClass("chartLoading");
		
		var columnChart = new google.visualization.ColumnChart($('#chart-' + question.id + "-column")[0]);
		columnChart.draw(dataTable, options);
		$('#chart-' + question.id + "-column").removeClass("chartLoading");
	}
	
	function _drawDashboardWeeklyVotes(dataTable) {
		var options = {
				'title'	: 'Respuestas por semana',
				'hAxis'	: {
							'title'	: 'Semana',
				},
		}
		
		_drawDashboardVotes(dataTable, '#chart-weeklyVotes', options);
	}
	
	function _drawDashboardDayVotes(dataTable) {
		var options = {
				'title' : 'Respuestas por d�a',
				'hAxis'	: {
							'title'	: 'D�a',
				},
		}
		
		_drawDashboardVotes(dataTable, '#chart-dayVotes', options);
	}
	
	function _drawDashboardVotes(dataTable, container, ops) {
		var options = {
				'animation' 	: {
									'duration' : 700,
								  },
				'titleTextStyle': {
									'fontSize' : 14,
								  }, 
				'width' 		: 350,
				'height'		: 250,
				'colors'		: seriesColors,
				'legend'		: {
									'position' : 'none',
								  },
				'backgroundColor': 'transparent',
				'tooltip' 		: { 
									'showColorCode' : true,
									'textStyle': {
													'fontSize' : 12,
												 },
								  },
				
		};
		
		var lineChart = new google.visualization.AreaChart($(container + '-lineChart')[0]);
		lineChart.draw(dataTable, $.extend(options, ops));
		$(container + '-lineChart').removeClass("chartLoading");
		
//		$(container + '-lineChart').width(350);
//		$(container + '-lineChart').height(200);
//		var chart = new Dygraph.GVizChart($(container + '-lineChart')[0])
//		chart.draw(dataTable, {
//            title: 'Votos por d�a',
//            labelsDivStyles: { 'textAlign': 'right' },
//            showRangeSelector: true
//		});
		
		var columnChart = new google.visualization.ColumnChart($(container + '-columnChart')[0]);
		columnChart.draw(dataTable, $.extend(options, ops));
		$(container + '-columnChart').removeClass("chartLoading");
	}
	
	function _drawQuestionChart(options) {
		
		var _options = {
				chartOptions	: {},
				chartType		: "pie",
				chartContainer	: "",
		};
		
		_options = $.extend(_options, options);
		
		var dataTable = new google.visualization.DataTable(_options.data);
		
		var chartOptions = {
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
		
		chartOptions = $.extend(chartOptions, _options.chartOptions);
		var chart = null;
		
		switch (_options.chartType) {
			case "barChart"	:
				chart = new google.visualization.BarChart($("#" + _options.chartContainer)[0]);
				break;
	
			case "lineChart"	:
				//chartOptions.width = 500;
				chartOptions.width = null;
				chartOptions.height = null;
				chartOptions.showRangeSelector = true;
				chartOptions.strokeWidth = 2;
				chart = new Dygraph.GVizChart($("#" + _options.chartContainer)[0]);
				break;
			
			case "pieChart"	:
				
				//Para el caso de los piecharts hay que sumar las columnas.
				pieData = new google.visualization.DataTable();
				pieData.addColumn('string');
				pieData.addColumn('number');
				
				for(var i = 0; i < dataTable.getNumberOfRows(); i++) {
					
					var rowSum = 0;
					
					for(var j = 1; j < dataTable.getNumberOfColumns(); j++) {
						rowSum += parseInt(dataTable.getFormattedValue(i, j));
					}
					
					//S�lo dejamos las columnas que son mayores que 0.
					if(rowSum > 0) {
						pieData.addRow([dataTable.getFormattedValue(i, 0), rowSum]);
					}
				}
				
				dataTable = pieData;
				
				chart = new google.visualization.PieChart($("#" + _options.chartContainer)[0]);
				break;
				
			case "columnChart":
				chart = new google.visualization.ColumnChart($("#" + _options.chartContainer)[0]);
				break;
		};
		
		if(chart != null) {
			chart.draw(dataTable, chartOptions);
			$("#" + _options.chartContainer).removeClass("chartLoading");
		}
	}
	
	return {
		DrawDashboardQuestionChart	: _drawDashboardQuestionChart,
		DrawDashboardDayVotes 		: _drawDashboardDayVotes,
		DrawDashboardWeeklyVotes 	: _drawDashboardWeeklyVotes,
		
		DrawQuestionChart			: _drawQuestionChart,
	};
}(jQuery));