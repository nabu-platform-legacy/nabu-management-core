window.addEventListener("load", function () {
	// initialize vue
	application.initialize.vue();
	// route to initial state
	application.services.router.routeInitial();
	
	for (var i = 0; i < application.initialize.modules.length; i++) {
		application.initialize.modules[i]();
	}
});