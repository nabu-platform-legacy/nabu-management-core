if (!application) { var application = {} };
if (!application.definitions) { application.definitions = {} }

application.definitions.Manager = function Manager($services) {
	var self = this;
	
	this.state = {
		dashboards: [],
		menus: [],
		// start at 1, everything "unknown" is 0
		counter: 1,
		connections: null,
		dialects: null,
		connection: null,
		tableView: $services.cookies.get("tableView", "false") == "true"
	};
	
	// make it watchable
	Vue.observe(this.state, true);
	
	var sorter = function(a, b) {
		var i1 = a.index ? a.index : 0;
		var i2 = b.index ? b.index : 0;
		if (i1 == i2) {
			i1 = a.counter ? a.counter : 0;
			i2 = b.counter ? b.counter : 0;
		}
		return i1 - i2;
	};
	
	this.dashboard = function(dashboard) {
		this.state.dashboards.push(dashboard);
		this.state.dashboards.sort(sorter);
	}
	
	this.menu = function(menu) {
		this.state.menus.push(menu);
		this.state.menus.sort(sorter);
	}
	
	this.findMenu = function(title) {
		for (var i = 0; i < this.state.menus.length; i++) {
			if (this.state.menus[i].title == title) {
				return this.state.menus[i];
			}
		}
		return null;
	}
	
	this.index = function() {
		return this.state.counter++;
	}
	
	this.dashboards = function() {
		return this.state.dashboards;
	}
	
	this.menus = function() {
		return this.state.menus;
	}
	
	this.connection = function() {
		if (arguments.length > 0) {
			this.state.connection = arguments[0];
			$services.cookies.set("connectionId", this.state.connection);
		}
		return this.state.connection;
	}
	
	this.connections = function() {
		return this.state.connections;
	}
	
	this.dialects = function() {
		return this.state.dialects;
	}
	
	this.tableView = function() {
		if (arguments.length > 0) {
			this.state.tableView = arguments[0];
			$services.cookies.set("tableView", this.state.tableView);
		}
		return this.state.tableView;
	}
	
	this.$initialize = function() {
		return $services.q.defer($services.swagger.execute("nabu.management.core.rest.connections.list").then(function(connectionList) {
			self.state.connections = connectionList.ids ? connectionList.ids : [];
			self.state.connections.sort();
			self.state.dialects = connectionList.dialects ? connectionList.dialects : [];
			self.state.dialects.sort();
			var previousConnection = $services.cookies.get("connectionId");
			if (previousConnection && self.state.connections.indexOf(previousConnection) >= 0) {
				self.state.connection = previousConnection;
			}
			else {
				self.state.connection = self.state.connections ? self.state.connections[0] : null;
			}
		}), self);
	}
};