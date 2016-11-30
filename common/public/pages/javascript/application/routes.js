application.services.router.register({
	alias: "index",
	enter: function() {
		return new application.views.Index();
	},
	initial: true
});

application.services.router.register({
	alias: "home",
	enter: function() {
		return new application.views.Home();
	},
	url: "/"
});
