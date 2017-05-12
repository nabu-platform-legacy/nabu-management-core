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
		}
	},
	computed: {
		dashboards: function() {
			var dashboards = [];
			// not the most performant but readable
			for (var i = 0; i < this.$services.vue.row; i++) {
				var row = [];
				for (var j = 0; j < this.$services.vue.dashboards.length; j++) {
					if (this.$services.vue.dashboards[j].row == i) {
						row.push(this.$services.vue.dashboards[j]);
					}
				}
				dashboards.push(row);
			}
			return dashboards;
		}
	}
});