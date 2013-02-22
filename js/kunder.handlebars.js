Handlebars.getTemplate = function(name, dir) {
	dir = typeof dir !== 'undefined' ? dir : "../";
	
	if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
		$.ajax({
			type: 'GET',
			url : dir + 'templates/' + name + '.htm',
			success : function(data) {
				if (Handlebars.templates === undefined) {
					Handlebars.templates = {};
				}
				Handlebars.templates[name] = Handlebars.compile(data);
			},
			async : false
		});
	}
	return Handlebars.templates[name];
};

Handlebars.printTemplate = function(name, data, dir){
	dir = typeof dir !== 'undefined' ? dir : "../";
	
	var template = Handlebars.getTemplate(name, dir);
	document.write(template(data));
};