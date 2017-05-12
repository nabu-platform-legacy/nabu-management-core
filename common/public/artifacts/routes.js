if (!application) { var application = {}; }

application.routes = function($services) {
	$services.router.register({
		alias: "index",
		enter: function() {
			return new application.views.Index();
		},
		initial: true
	});
	$services.router.register({
		alias: "home",
		enter: function() {
			return new application.views.Home();
		},
		url: "/"
	});
}