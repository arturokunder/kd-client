jQuery.Menu = (function($) {
	
	function _createMenu(container, url) {
		var questions = $.Storage.getQuestions(2);
		
		if(questions != null) {
			var data = JSON.parse(questions);
			
			var menu = Handlebars.getTemplate("menu");
			container.html(menu({ data : data}));
			
			//Para partir con elemento seleccionado
			var selected = $("[href='" + url + "']");
			selected.closest('.menu > li').children('a').addClass('active').next().slideToggle();
			selected.parent().append($('<div>').attr("class", "sideMenuLoading"));
		}
		
		$(document).ready(function () {
			//Menu UI, abre el menu en caso de que el click sea en un elemento principal
			$('.menu > li > a').click(function(){
			    var isActive = $(this).attr('class') == 'active';
				 
				$('.menu li ul').slideUp();
				$('.menu li a').removeClass('active');
				
				if (!isActive){
					$(this).addClass('active');
					$(this).next().slideToggle();
			    }
		  	});
			//Change page, si href está definido el click cambia de página, si no no pasa nada
			$("[href]").click(function(e) {
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
		$(window).on("popstate", _popstate);
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
			},
		});
	}
	
	return {
		CreateMenu	: _createMenu,
		ChangePage	: _changePage,
	};
}(jQuery));