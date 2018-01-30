Vue.directive("route", {
	// the argument should be the name of the route, any value is passed in as parameters
	// the modifier is interpreted as the anchor to route it to
	bind: function(element, binding, vnode) {
		var url = vnode.context.$services.router.template(binding.arg, binding.value);
		var keys = null;
		if (binding.modifiers) {
			keys = Object.keys(binding.modifiers);
		}
		var all = keys.indexOf("all") >= 0;
		if (all) {
			keys.splice(keys.indexOf("all"), 1);
		}
		if (keys && keys.indexOf("absolute") >= 0) {
			url = "${environment('url')}" + url;
			keys.splice(keys.indexOf("absolute"), 1);
		}
		var mask = false;
		if (keys && keys.indexOf("mask") >= 0) {
			mask = true;
			keys.splice(keys.indexOf("mask"), 1);
		}
		// make sure we don't do anything else
		if (element.tagName.toLowerCase() == "a") {
			element.setAttribute("href", url);
//			element.setAttribute("href", "javascript:void(0)");
			// internet explorer and edge do _not_ send out a popstate event when we change the hash with a href
			// for this reason we register an onclick that is executed before the href and returns false to stop the default href behavior
			// this gives us clean hrefs for server-side rendering / social media sharing / ... yet a functional route change in all browsers
			element.onclick = function(event) {
				if (all) {
					vnode.context.$services.router.routeAll(binding.arg, binding.value, keys && keys.length ? keys[0] : null, mask);
				}
				else {
					vnode.context.$services.router.route(binding.arg, binding.value, keys && keys.length ? keys[0] : null, mask);
				}
				return false;
			};
		}
		else {
			element.addEventListener("click", function(event) {
				if (all) {
					vnode.context.$services.router.routeAll(binding.arg, binding.value, keys && keys.length ? keys[0] : null, mask);
				}
				else {
					vnode.context.$services.router.route(binding.arg, binding.value, keys && keys.length ? keys[0] : null, mask);
				}
			});
		}
	}
});