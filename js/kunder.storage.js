jQuery.Storage = (function($) {
	
	function _setLoginParams(user, pass) {
		window.localStorage.setItem("user", user);
		window.localStorage.setItem("pass", pass);
	}
	
	function _getUser() {
		return window.localStorage.getItem("user");

	}
	
	function _getPassword() {
		return window.localStorage.getItem("pass");
	}
	
	return {
		setLoginParams	: _setLoginParams,
		
		getUser			: _getUser,
		getPassword		: _getPassword,
		
	};
}(jQuery));
