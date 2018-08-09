// the argument should be the name of the route, any value is passed in as parameters
// the modifier is interpreted as the anchor to route it to
Vue.directive("content", function(element, binding, vnode) {
	var content = binding.value;
	var keys = null;
	if (binding.modifiers) {
		keys = Object.keys(binding.modifiers);
	}
	// always clear the element
	nabu.utils.elements.clear(element);
	if (content != null && typeof(content) != "undefined") {
		var parameters = {};
		if (keys && keys.indexOf("parameterized") >= 0) {
			parameters = content;
			content = content.value;
		}
		if (content != null && typeof(content) != "undefined") {
			if ((keys && keys.indexOf("sanitize") >= 0) || parameters.sanitize) {
				content = nabu.utils.elements.sanitize(content);
			}
			// we interpret this as plain string data, that means making sure everything is escaped and whitespace is adhered to
			if ((keys && keys.indexOf("plain") >= 0) || parameters.plain) {
				content = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
					.replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
					// breaks default wrapping..
					//.replace(/ /g, "&nbsp;");
			}
			if ((keys && keys.indexOf("compile") >= 0) || parameters.compile) {
				var context = {};
				Object.keys(vnode.context.$props).map(function(key) {
					if (typeof(vnode.context.$props[key]) !== "undefined") {
						context[key] = vnode.context.$props[key];
					}
				});
				// data overwrites props if necessary
				Object.keys(vnode.context.$data).map(function(key) {
					if (typeof(vnode.context.$data[key]) !== "undefined") {
						context[key] = vnode.context.$data[key];
					}
				});
				var component = Vue.extend({
					data: function() {
						return context;
					},
					template: "<div>" + (typeof(content) == "string" ? content : content.innerHTML) + "</div>" 
				});
				content = new component();
				content.$mount();
				
				var insertBefore = null;
				for (var i = content.$el.childNodes.length - 1; i >= 0; i--) {
					if (insertBefore == null) {
						insertBefore = element.appendChild(content.$el.childNodes[i]);
					}
					else {
						insertBefore = element.insertBefore(content.$el.childNodes[i], insertBefore);
					}
				}
			}
			else if (typeof(content) == "string") {
				element.innerHTML = content;
			}
			else {
				element.appendChild(content);
			}
		}
	}
});