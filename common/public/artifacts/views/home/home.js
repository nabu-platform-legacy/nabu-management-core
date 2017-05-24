application.views.Home = Vue.extend({
	template: "#home",
	data: function() {
		return {
			rows: 0
		};
	},
	methods: {
		getId: function(dashboard) {
			var id = "dashboard." + dashboard.alias;
			if (dashboard.id) {
				id += "." + dashboard.id;
			}
			return id;
		},
		sorter: function(a, b) {
			var i1 = a.index ? a.index : 0;
			var i2 = b.index ? b.index : 0;
			return i1 - i2;
		},
		render: function(route, element) {
			this.$services.router.route(route.alias, route.parameters, element, true);
		}
	},
	computed: {
		dashboards: function() {
			var dashboards = [];
			nabu.utils.arrays.merge(dashboards, this.$services.manager.dashboards());
			//dashboards.sort(this.sorter);
			return dashboards;
		}
	}
});