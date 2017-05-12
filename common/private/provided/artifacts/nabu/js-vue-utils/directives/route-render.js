Vue.directive("route-render", {
	// the argument should be the name of the route, any value is passed in as parameters
	// the modifier is interpreted as the anchor to route it to
	bind: function(element, binding, vnode) {
		var object = binding.value;
		vnode.context.$services.router.route(object.alias, object.parameters, element, object.mask);
	}
});