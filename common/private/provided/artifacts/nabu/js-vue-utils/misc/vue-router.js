if (!nabu) { var nabu = {}; }
if (!nabu.components) { nabu.components = {}; }
if (!nabu.services) { nabu.services = {}; }
if (!nabu.state) { nabu.state = {}; }
if (!nabu.utils) { nabu.utils = {}; }

nabu.services.VueRouter = function(routerParameters) {
	var self = this;
	this.components = {};
	this.router = new nabu.services.Router(routerParameters);

	this.useProps = routerParameters.useProps;
	this.route = function(alias, parameters, anchor, mask) {
		return self.router.route(alias, parameters, anchor, mask);
	}
	this.routeInitial = function(anchor) {
		this.router.routeInitial(anchor);
	};
	this.updateUrl = this.router.updateUrl;
	this.routeAll = this.router.routeAll;
	this.bookmark = this.router.bookmark;
	this.register = function(route) {
		route = self.create(route);
		self.router.register(route);
		return route;
	};
	this.unregister = this.router.unregister;
	this.template = function(alias, parameters) {
		return self.router.template(alias, parameters);
	};
	this.get = function(alias) {
		return self.router.get(alias);
	};
	this.list = function() {
		return self.router.list();
	};
	this.create = function(route) {
		if (route.enter) {
			var originalEnter = route.enter;
			route.enter = function(anchorName, parameters, previousRoute, previousParameters, currentRoute) {
				var render = function() {
					if (!route.$lastInstances) {
						route.$lastInstances = {};
					}
					var component = null;
					if (originalEnter) {
						component = originalEnter(parameters, previousRoute, previousParameters, currentRoute);
					}
					else if (route.component) {
						if (typeof(route.component) == "string") {
							component = eval(route.component);
							component = new component(self.useProps ? {propsData: parameters} : { data: parameters });
						}
						else {
							component = new route.component(self.useProps ? {propsData: parameters} : { data: parameters });
						}
					}
					route.$lastInstances[anchorName] = nabu.utils.vue.render({
						target: anchorName,
						content: component,
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
					return route.$lastInstances[anchorName];
				};
				var promises = [];
				// initialize any lazy services
				if (route.services && routerParameters.services) {
					for (var i = 0; i < route.services.length; i++) {
						var name = route.services[i].split(".");
						var target = routerParameters.services;
						for (var j = 0; j < name.length; j++) {
							if (!target) {
								throw "Could not find service: " + route.services[i];
							}
							target = target[name[j]];
						}
						if (!target) {
							throw "Could not find service '" + route.services[i] + "' for route: " + route.alias;
						}
						if (target.$lazy && !target.lazyInitialized) {
							target.lazyInitialized = new Date();
							var result = target.$lazy();
							if (result.then) {
								promises.push(result);
							}
						}
					}
				}
				var promise = new nabu.utils.promise();
				new nabu.utils.promises(promises).then(function() {
					promise.resolve(render());
				});
				return promise;
			};
		}
		var originalLeave = route.leave;
		route.leave = function(anchorName, currentParameters, newRoute, newParameters) {
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