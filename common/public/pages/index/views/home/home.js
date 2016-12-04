application.views.Home = Vue.extend({
	template: "#home",
	data: function() {
		return {
			dashboards: null,
			rows: 0
		};
	},
	ready: function() {
		this.dashboards = this.$application.services.vue.dashboards;
	},
	methods: {
		getId: function(dashboard) {
			var id = "dashboard." + dashboard.alias;
			if (dashboard.id) {
				id += "." + dashboard.id;
			}
			return id;
		},
		getRow: function(row) {
			var dashboards = [];
			for (var i = 0; i < this.$application.services.vue.dashboards.length; i++) {
				if (this.$application.services.vue.dashboards[i].row == row) {
					dashboards.push(this.$application.services.vue.dashboards[i]);
				}
			}
			return dashboards;
		}
	},
	watch: {
		dashboards: function() {
			for (var i = 0; i < this.dashboards.length; i++) {
				this.$application.services.router.route(
					this.dashboards[i].alias,
					this.dashboards[i].parameters,
					this.getId(this.dashboards[i]),
					true
				);
			}
		}
	}
});