window.addEventListener("load", function () {
	// make sure we can target the browser using css
	document.documentElement.setAttribute("data-useragent", navigator.userAgent);
	application.initialize().then(function() {
		var promises = [];
		// load the modules	
		for (var i = 0; i < application.configuration.modules.length; i++) {
			var promise = application.configuration.modules[i](application.services);
			if (promise) {
				promises.push(promise);
			}
		}
		// route to initial state
		application.services.q.all(promises).then(function() {
			application.services.router.routeInitial();
		}, function() {
			application.services.router.routeInitial();
		});
	});
});