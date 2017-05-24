Vue.directive("route-render", {
	// the argument should be the name of the route, any value is passed in as parameters
	// the modifier is interpreted as the anchor to route it to
	bind: function(element, binding, vnode) {
		vnode.context.$services.router.route(binding.value.alias, binding.value.parameters, element, true);
		element["n-route-render-route"] = binding.value;
	},
	update: function(element, binding, vnode) {
		if (element["n-route-render-route"] != binding.value) {
			element["n-route-render-route"] = binding.value;
			vnode.context.$services.router.route(binding.value.alias, binding.value.parameters, element, true);
		}
	}
});