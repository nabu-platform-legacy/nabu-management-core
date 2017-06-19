Vue.component("n-connection", {
	template: "#connection",
	data: function() {
		return {
			showing: false
		}
	},
	created: function() {
		this.connections = this.$services.manager.connections();
	}
})