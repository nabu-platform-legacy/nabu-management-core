window.addEventListener("load", function () {
	// make sure we can target the browser using css
	document.documentElement.setAttribute("data-useragent", navigator.userAgent);
	application.initialize().then(function() {
		// load the modules	
		for (var i = 0; i < application.configuration.modules.length; i++) {
			application.configuration.modules[i](application.services);
		}
		// route to initial state
		application.services.router.routeInitial();
	});
});