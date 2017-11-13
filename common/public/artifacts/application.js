if (!application) { var application = {} }

application.configuration = {
	scheme: {
		http: "${when(environment('secure'), 'https', 'http')}",
		ws: "${when(environment('secure'), 'wss', 'ws')}"
	},
	url: "${environment('url', 'http://127.0.0.1')}",
	host: "${environment('host', '127.0.0.1')}",
	// lambdas to bootstrap modules
	modules: []
};

application.views = {};

Vue.component("n-table-view", {
	template: "<button @click='$services.manager.tableView(!$services.manager.tableView())'><span class='n-icon' :class=\"{'n-icon-th': !$services.manager.tableView(), 'n-icon-list': $services.manager.tableView()}\"></span></button>"
})

application.initialize = function() {
	application.services = new nabu.services.ServiceManager({
		mixin: function(services) {
			Vue.mixin({
				// inject some services for use
				computed: {
					$configuration: function() { return application.configuration },
					$services: function() { return services },
					$views: function() { return application.views },
					$application: function() { return application }
				},
				methods: {
					formatDateTime: function(value) {
						return value ? new Date(value).toLocaleString() : null;
					},
					formatDate: function(value) {
						return value ? new Date(value).toLocaleDateString() : null;
					}
				}
			});	
		},
		q: nabu.services.Q,
		cookies: nabu.services.Cookies,
		swagger: application.definitions.Swagger,
		manager: application.definitions.Manager,
		router: function router($services) {
			this.$initialize = function() {
				return new nabu.services.VueRouter({
					useHash: true,
					unknown: function(alias, parameters, anchor) {
						return application.services.router.register({
							alias: alias,
							enter: function() {
								return alias;
							}
						});
					},
					chosen: function(anchor, newRoute, newParameters, oldRoute, oldParameters) {
						// redirect to the default page if any is set
						if (newRoute.alias == "home") {
							var defaultPath = "${when(application.configuration("nabu.management.core.configuration")/defaultPath == null, "", application.configuration("nabu.management.core.configuration")/defaultPath)}";
							if (defaultPath) {
								return $services.router.router.findRoute(defaultPath);
							}
						}	
					},
					enter: function(anchor, newRoute, newParameters, oldRoute, oldParameters, newRouteReturn) {
						$services.vue.route = newRoute.alias;
						// reset scroll
						document.body.scrollTop = 0;
					},
					leave: function() {
						// reset quick menu
						$services.manager.quickmenu([]);
					},
					services: $services
				});
			}
		},
		vue: function vue() {
			this.$initialize = function() {
				return new Vue({
					el: "body",
					data: {
						route: null
					}
				});
			}
		},
		routes: application.routes});
	return application.services.$initialize();
};
