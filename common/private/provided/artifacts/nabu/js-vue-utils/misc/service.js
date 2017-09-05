if (!nabu) { var nabu = {}; }
if (!nabu.services) { nabu.services = {}; }

nabu.services.VueService = function(component, parameters) {
	component.render = function(done) {
		// do nothing, a service has no DOM presence
		return done();
	}
	
	var service = function($services) {
		var activate = function(instance) {
			if (instance.$options && instance.$options.activate) {
				if (instance.$options.activate instanceof Array) {
					var promises = [];
					var process = function(activation) {
						var promise = $services.q.defer();
						promises.push(promise);
						var done = function(result) {
							promise.resolve(result);
						};
						activation.call(instance, done);
					}
					for (var i = 0; i < instance.$options.activate.length; i++) {
						process(instance.$options.activate[i]);
					}
					return $services.q.defer($services.q.all(promises), instance);
				}
				else {
					var promise = $services.q.defer();
					var done = function(result) {
						promise.resolve(result);
					};
					instance.$options.activate.call(instance, done);
					return $services.q.defer(promise, instance);
				}
			}
			else {
				return instance;
			}
		};
		
		this.$initialize = function() {
			var instance = new component({ data: { "$services": $services }});
			if (parameters && parameters.lazy) {
				instance.$lazy = function() {
					return activate(instance);
				};
			}
			if (!parameters || !parameters.lazy) {
				return activate(instance);
			}
			else {
				return instance;
			}
		}
		
	}
	
	if (parameters && parameters.name) {
		var parts = parameters.name.split(".");
		var target = window;
		for (var i = 0; i < parts.length - 1; i++) {
			if (!target[parts[i]]) {
				target[parts[i]] = {};
			}
			target = target[parts[i]];
		}
		target[parts[parts.length - 1]] = service;
	}
	
	return service;
}

// mixin an activation sequence for lazy service loading
Vue.mixin({
	activate: function(done) {
		if (this.$options.services) {
			if (!this.$services) {
				throw "No service provider found";
			}
			var promises = [];
			for (var i = 0; i < this.$options.services.length; i++) {
				var name = this.$options.services[i].split(".");
				var target = this.$services;
				for (var j = 0; j < name.length; j++) {
					if (!target) {
						throw "Could not find service: " + this.$options.services[i];
					}
					target = target[name[j]];
				}
				if (!target.$lazyInitialized && target.$lazy) {
					target.$lazyInitialized = new Date();
					var result = target.$lazy();
					if (result.then) {
						promises.push(result); 
					}
				}
			}
			this.$services.q.all(promises).then(function() {
				done();
			});
		}
		else {
			done();
		}
	}
});