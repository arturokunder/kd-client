jQuery.Menu = (function($) {
	
	var _menuContainer = null;
	
	function _createMenu(container, url) {
		_menuContainer = container;
		var questions = $.Storage.getQuestions(2);
		
		if(questions != null) {
			var data = JSON.parse(questions);
			
			var menu = Handlebars.getTemplate("menu");
			container.html(menu({ data : data}));
			
			/*
			$(document).ready(function() {
			$('.menu li a').filter(function() { 
				//return $(this).attr('href') && $(this).attr('href') == url ? 1 : 0;
				if($(this).attr('href') && $(this).attr('href') == url) {
					alert("find");
					return 1;
				}
				return 0;
			}).click();
			});*/
			//element.addClass('active');
			//element.next().slideToggle(); 
		}
		
		$(document).ready(function () {
			$('.menu > li > a').click(function(){
			    var isActive = $(this).attr('class') == 'active';
				 
				$('.menu li ul').slideUp();
				$('.menu li a').removeClass('active');
				
				if (!isActive){
					$(this).addClass('active');
					$(this).next().slideToggle();
			    }
		  	});
			$('.menu li a')
				.filter(function() { 
					return $(this).attr('href') ? 1 : 0; 
				}).click(function(e) {
					e.preventDefault();
					$.Menu.ChangePage($(this).attr("href"));
					$(this).parent().append($('<div>').attr("class", "sideMenuLoading"));
				}
			);
		});
		
		_suscribeEvent();
	}
	
	function _suscribeEvent() {
		$(document).on("questionsChanged", _questionsChanged);
		$(document).on("pageLoaded", _pageLoaded);
		$(window).bind("popstate", _popstate);
	}
	
	function _questionsChanged(e) {
		_createMenu(_menuContainer);
	}
	
	function _pageLoaded() {
		$('.sideMenuLoading').remove();
	}
	
	function _popstate(event) {
		var state = event.originalEvent.state;
		if(state) {
			_getPage(state.page);
		}
		else {
		}
	}
	
	function _changePage(url) {
		history.pushState({page:url}, "", url);
		_getPage(url);
	}
	
	function _getPage(url) {
		$.ajax({
			type: 'GET',
			url : url,
			cache: false, //TODO: para debug
			success : function(data) {	
				$('#rightContent').html($(data).find("#rightContent").html());
				$(document).trigger('pageLoaded', []);
			},
		});
	}
	
	return {
		CreateMenu	: _createMenu,
		ChangePage	: _changePage,
	};
}(jQuery));