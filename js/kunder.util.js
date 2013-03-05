//Entrega fecha y hora UTC en formato YYYY-MM-DD hh:mm:ss
jQuery.DateTimeFormatter = (function($) {
		
		function _format(date) {
			
			return date.getUTCFullYear() + "-" + _formatNumber((date.getUTCMonth() + 1)) + "-" + _formatNumber(date.getUTCDate()) + " " 
           	+ _formatNumber(date.getUTCHours()) + ":" + _formatNumber(date.getUTCMinutes()) + ":" + _formatNumber(date.getUTCSeconds());
		}
		
		function _now() {
			return _format(new Date());
		}
		
		function _endOfDay(date) {
			var date = new Date();
			date.setHours(23, 59, 59, 999);
			return _format(date);
		}
		
		function _endOfToday() {
			return _endOfDay(new Date());
		}
		
		function _formatNumber(number) {
			if(parseInt(number) == Number.NaN)
			{
				return number;
			}
			
			if(number < 10 && number > -10)
			{
				return "0" + number;
			}
			else
			{
				return "" + number;
			}
		}
		
	  return {
		    Now: _now,
		    Format: _format,
		    EndOfDay : _endOfDay,
		    EndOfToday : _endOfToday,
		  };
}(jQuery));

jQuery.CSSProperty = (function($) {
	
	function _getCSSPropertyFromClass(prop, fromClass) {

		var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
		$("body").append($inspector); // add to DOM, in order to read the CSS property
    
		try 
		{
			return $inspector.css(prop);
		} 
		
		finally 
		{
			$inspector.remove(); // and remove from DOM
		}
	}
	
	return {
		GetCSSPropertyFromClass: _getCSSPropertyFromClass
		};
}(jQuery));

//Sorter para ordenar por cualquier propiedad de algún arreglo
jQuery.Sorter = (function($) {
	
	function _sortAsc(array, property) {
		return _sort(array, property, true);
	}
	
	function _sortDesc(array, property) {
		return _sort(array, property, false);
	}
	
	function _sort(array, property, asc) {
		array = array.sort(function(a,b) {
			if(a[property] == b[property]) {
				return 0;
			}
			if(asc) return a[property]> b[property] ? 1 : -1;
			else return a[property]> b[property] ? -1 : 1;
		});
		
		return array;
	}
	
	return {
		SortAsc: _sortAsc,
		SortDesc: _sortDesc,
	};
	
}(jQuery));

//jQuery.fn.sort = function() {  
//    return this.pushStack( [].sort.apply( this, arguments ), []);  
//};  
//
// function sortByOrder(a,b){  
//     if (a.order == b.order){
//       return 0;
//     }
//     return a.order> b.order ? 1 : -1;  
// };  
//  function sortByOrderDesc(a,b){  
//     return sortOrder(a,b) * -1;  
// };