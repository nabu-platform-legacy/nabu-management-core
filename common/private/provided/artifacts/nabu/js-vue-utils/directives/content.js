Vue.directive("content", {
	// the argument should be the name of the route, any value is passed in as parameters
	// the modifier is interpreted as the anchor to route it to
	bind: function(element, binding, vnode) {
		var content = binding.value;
		var keys = null;
		if (binding.modifiers) {
			keys = Object.keys(binding.modifiers);
		}
		if (keys && keys.indexOf("sanitize") >= 0) {
			content = nabu.utils.elements.sanitize(content);
		}
		if (keys && keys.indexOf("compile") >= 0) {
			content = Vue.extend({
				template: "<div>" + (typeof(content) == "string" ? content : content.innerHTML) + "</div>" 
			});
			content = new content();
			content.$mount();
			element.appendChild(content.$el);
		}
		else if (typeof(content) == "string") {
			element.innerHTML = content;
		}
		else {
			element.appendChild(content);
		}
	}
});