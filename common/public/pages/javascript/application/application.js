var application = {
	configuration: {
		url: "${environment('url', 'http://127.0.0.1')}",
		host: "${environment('host', '127.0.0.1')}"
	},
	services: {
		router: new nabu.services.VueRouter({
			useHash: true,
			unknown: function(alias, parameters, anchor) {
				return application.services.router.register({
					alias: alias,
					enter: function() {
						return alias;
					}
				});
			}
		})
	},
	views: {},
	components: {},
	utils: {},
	initialize: {
		vue: function () {
			application.services.vue = new Vue({
				el: 'body',
				data: {
					row: 0,
					// objects that point to the routes used to display dashboard components
					dashboards: [],
					menu: [{
						title: "Home",
						handle: function() {
							application.services.router.route("home");
						}
					}]
				},
				methods: {
					getDashboardRow: function() {
						return this.row++;
					}
				},
				created: function () {
					this.$broadcast("vue.ready");
				},
				watch: {
					dashboards: function(value) {
						if (this.$el.getAttribute("route") == "home") {
							application.services.router.route("home");
						}
					}
				}
			});
		},
		// lambdas to bootstrap modules
		modules: []
	}
};
Vue.mixin({
	computed: {
		$application: function() {
			return application;
		}
	},
	methods: {
		formatDate: function(value) {
			return value ? new Date(value).toDateString() : null;
		},
		formatDateTime: function(value) {
			return value ? new Date(value).toLocaleString() : null;
		}
	},
	filters: {
		formatDate: function(value) {
			return this.formatDate(value);
		},
		formatDateTime: function(value) {
			return this.formatDateTime(value);
		}
	}
});