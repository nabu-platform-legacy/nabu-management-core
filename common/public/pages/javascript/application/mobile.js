document.addEventListener("deviceready", function () {
	// initialize vue
	application.initialize.vue();
	// route to initial state
	application.services.router.routeInitial();
});