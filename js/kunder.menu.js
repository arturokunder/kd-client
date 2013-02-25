jQuery.Menu = (function($) {
	
	var _menuContainer = null;
	
	function _createMenu(container) {
		_menuContainer = container;
		var questions = $.Storage.getQuestions(2);
		
		if(questions != null) {
			var data = JSON.parse(questions);
			
			var menu = Handlebars.getTemplate("menu");
			container.html(menu({ data : data}));
		}
		
		_suscribeEvent();
	}
	
	function _suscribeEvent() {
		$(document).on("questionsChanged", _questionsChanged);
	}
	
	function _questionsChanged(e) {
		_createMenu(_menuContainer);
	}
	
	return {
		CreateMenu	: _createMenu,
	};
}(jQuery));