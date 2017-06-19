Vue.directive("focus", {
	inserted: function(element, binding, vnode) {
		setTimeout(function() {
			var children = element.getElementsByTagName("input");
			if (children.length) {
				children[0].focus();
			}
			else {
				element.focus();
			}
		}, 50);
	}
});