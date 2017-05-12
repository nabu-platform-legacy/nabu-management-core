if (!nabu) { var nabu = {}; }
if (!nabu.components) { nabu.components = {}; }
if (!nabu.services) { nabu.services = {}; }
if (!nabu.state) { nabu.state = {}; }
if (!nabu.utils) { nabu.utils = {}; }

nabu.services.VueRouter = function(parameters) {
	var self = this;
	this.components = {};
	this.router = new nabu.services.Router(parameters);

	this.route = function(alias, parameters, anchor, mask) {
		this.initialize();
		self.router.route(alias, parameters, anchor, mask);
	}
	this.routeInitial = function(anchor) {
		this.initialize();
		this.router.routeInitial(anchor);
	};
	this.register = function(route) {
		route = self.create(route);
		self.router.register(route);
		return route;
	};
	this.create = function(route) {
		if (route.enter) {
			var originalEnter = route.enter;
			route.enter = function(anchorName, parameters, previousRoute, previousParameters) {
				route.$lastInstance = nabu.utils.vue.render({
					target: anchorName,
					content: originalEnter(parameters, previousRoute, previousParameters),
					ready: function() {
						if (route.ready) {
							route.ready(parameters, previousRoute, previousParameters);
						}
					},
					prepare: function(element) {
						// enrich the anchor with contextually relevant information
						element.setAttribute("route", route.alias);
					}
				});
				return route.$lastInstance;
			};
		}
		var originalLeave = route.leave;
		route.leave = function(anchorName, currentParameters, newRoute, newParameters) {
			if (route.$lastInstance && route.$lastInstance.$options.beforeDestroy) {
				if (route.$lastInstance.$options.beforeDestroy instanceof Array) {
					// TODO: loop over them and use a combined promise
					route.$lastInstance.$options.beforeDestroy[0].call(route.$lastInstance);
				}
				else {
					route.$lastInstance.$options.beforeDestroy.call(route.$lastInstance);
				}
				route.$lastInstance = null;
			}
			var anchor = nabu.utils.anchors.find(anchorName);
			if (anchor) {
				for (var i = 0; i < anchor.$el.attributes.length; i++) {
					if (anchor.$el.attributes[i].name != "id") {
						anchor.$el.removeAttribute(anchor.$el.attributes[i].name);
					}
				}
			}
			if (originalLeave) {
				originalLeave(currentParameters, newRoute, newParameters);
			}
		};
		return route;
	};

	this.initialize = function() {
		// make sure we register the body anchor
		if (!nabu.state.anchors) {
			nabu.state.anchors = [];
		}
		// register the body as an anchor
		if (!nabu.utils.anchors.find("body")) {
			nabu.state.anchors.push({
				id: "body",
				$el: document.body,
				clear: function() {
					var childNodes = this.$el.childNodes;
					for (var i = childNodes.length - 1; i >= 0; i--) {
						if (!childNodes[i].tagName || childNodes[i].tagName.toLowerCase() != "template") {
							this.$el.removeChild(childNodes[i]);
						}
					}
				},
				show: function() {},
				hide: function() {}
			});
		}
	}
}

nabu.components.Anchor = Vue.component("anchor", {
	props: ["id", "hidden"],
	template: "<div id=\"{{ id }}\"><slot></slot></div>",
	created: function() {
		if (!nabu.state.anchors) {
			nabu.state.anchors = [];
		}
		// if an anchor already exists with this id, remove it
		var currentAnchor = nabu.utils.anchors.find(this.id);
		if (currentAnchor) {
			nabu.state.anchors.splice(nabu.state.anchors.indexOf(currentAnchor, 1));
		}
		// then add this anchor
		nabu.state.anchors.push(this);
	},
	activated: function() {
		if (this.hidden) {
			this.$el.style.display = "none";
		}
	},
	methods: {
		hide: function() {
			if (!this.hidden) {
				this.hidden = true;
				this.$el.style.display = "none";
			}
		},
		show: function() {
			if (this.hidden) {
				this.hidden = false;
				this.$el.style.display = "block";
			}
		},
		clear: function() {
			while (this.$el.firstChild) {
				this.$el.removeChild(this.$el.firstChild);
			}
		}
	}
});


nabu.utils.anchors = {
	find: function(id) {
		if (nabu.state.anchors) {
			for (var i = 0; i < nabu.state.anchors.length; i++) {
				if (nabu.state.anchors[i].id == id) {
					return nabu.state.anchors[i];
				}
			}
		}
		return null;
	}
};