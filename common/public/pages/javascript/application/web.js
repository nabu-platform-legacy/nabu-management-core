window.addEventListener("load", function () {
	// initialize vue
	application.initialize.vue();

	// load the modules	
	for (var i = 0; i < application.initialize.modules.length; i++) {
		application.initialize.modules[i]();
	}
	
	// route to initial state
	application.services.router.routeInitial();
});