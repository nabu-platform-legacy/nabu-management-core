// injects all the calculated style into the style attribute (e.g. for emails)
Vue.directive("style", {
	bind: function(element, binding) {
		element.setAttribute("style", window.getComputedStyle(element, null));
	},
	update: function(element, binding) {
		element.setAttribute("style", window.getComputedStyle(element, null));
	},
	unbind: function(element, binding) {
		element.removeAttribute("style");
	}
});