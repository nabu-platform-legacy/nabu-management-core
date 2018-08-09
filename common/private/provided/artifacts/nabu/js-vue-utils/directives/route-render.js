Vue.directive("route-render", {
	// the argument should be the name of the route, any value is passed in as parameters
	// the modifier is interpreted as the anchor to route it to
	// we use the inserted to make sure the parent exists and nextTick to ensure that it is rendered correctly and we have access to __vue__
	inserted: function(element, binding, vnode) {
		Vue.nextTick(function() {
			var keys = binding.modifiers ? Object.keys(binding.modifiers) : null;
			
			var parameters = {
				alias: binding.arg ? binding.arg : binding.value.alias,
				parameters: binding.arg ? binding.value : binding.value.parameters
			}
			var result = vnode.context.$services.router.route(parameters.alias, parameters.parameters, element, true);
			
			if (result && result.then) {
				result.then(function(component) {
					element["n-route-component"] = component;
					if (keys && keys.length) {
						if (vnode.context[keys[0]] instanceof Function) {
							vnode.context[keys[0]](component);
						}
						else {
							vnode.context.$refs[keys[0]] = component;
						}
					}
					if (binding.value.mounted) {
						binding.value.mounted(component);
					}
				});
			}
			element["n-route-render-route-json"] = JSON.stringify(parameters);
			element["n-route-render-route"] = parameters;
		});
	},
	unbind: function(element, binding, vnode) {
		// cascade a destroy to underlying elements
		var destroy = function(element) {
			for (var i = 0; i < element.childNodes.length; i++) {
				// first recursively destroy any vms that might exist
				if (element.childNodes[i].nodeType == 1) {
					destroy(element.childNodes[i]);
				}
			}
			// then destroy the vm itself (if there is one)
			if (element.__vue__ && element.__vue__.$destroy) {
				element.__vue__.$destroy();
			}
		}
		destroy(element);
	},
	update: function(element, binding, vnode) {
		// the update can be called before the insert + nextTick has initially triggered
		// we only want to re-render if we have rendered in the first place
		// otherwise we can have multiple renders
		if (element["n-route-render-route"]) {
			var keys = binding.modifiers ? Object.keys(binding.modifiers) : null;
		
			var parameters = {
				alias: binding.arg ? binding.arg : binding.value.alias,
				parameters: binding.arg ? binding.value : binding.value.parameters
			}
		
			var isExactCopy = element["n-route-render-route-json"] == JSON.stringify(parameters);
		
			if (!isExactCopy) {
				element["n-route-render-route-json"] = JSON.stringify(parameters);
			
				var isSameAlias = element["n-route-render-route"]
					&& element["n-route-render-route"].alias == parameters.alias;
			
				var isSame = isSameAlias
					&& element["n-route-render-route"].parameters == parameters.parameters;
				// check by reference
				if (!isSame && element["n-route-render-route"] && element["n-route-render-route"].parameters && parameters.parameters) {
					var parameterKeys = Object.keys(parameters.parameters);
					var availableParameterKeys = Object.keys(element["n-route-render-route"].parameters);
					if (parameterKeys.length == availableParameterKeys.length) {
						isSame = true;
						for (var i = 0; i < parameterKeys.length; i++) {
							if (element["n-route-render-route"].parameters[parameterKeys[i]] != parameters.parameters[parameterKeys[i]]) {
								isSame = false;
								break;
							}
						}
					}
				}

				if (!isSame) {
					element["n-route-render-route"] = parameters;

					if (!binding.value.rerender || binding.value.rerender()) {
						// in a past version, we required a different alias as well before we rerendered
						// perhaps we can do a strict mode?
						var result = vnode.context.$services.router.route(parameters.alias, parameters.parameters, element, true);
						if (result && result.then) {
							result.then(function(component) {
								element["n-route-component"] = component;
								if (keys && keys.length) {
									if (vnode.context[keys[0]] instanceof Function) {
										vnode.context[keys[0]](component);
									}
									else {
										vnode.context.$refs[keys[0]] = component;
									}
								}
								if (binding.value.mounted) {
									binding.value.mounted(component);
								}
							});
						}
					}
				}
			}
		}
	}
});