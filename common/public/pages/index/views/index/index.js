application.views.Index = Vue.extend({
	template: "#index",
	data: function() {
		return {
			menu: [{
					title: "Home",
					handle: function() {
						application.services.router.route("home");
					}
				}, {
					title: "Nabu",
					children: [{
							title: "Blogs",
							handle: function() {
								application.services.router.route("blogs", { directory: "nabu/blogs" });
							}
						}, {
							title: "Tutorials",
							handle: function() {
								application.services.router.route("articles", { directory: "nabu/tutorials" });
							}
						}, {
							title: "Videos",
							handle: function() {
								application.services.router.route("articles", { directory: "nabu/videos" });
							}
						}, {
							title: "Releases",
							handle: function() {
								application.services.router.route("article", { page: "nabu/Releases.md" });
							}
						}]
				}, {
					title: "Glue",
					children: [{
							title: "Documentation",
							handle: function() {
								application.services.router.route("articles", { directory: "glue/documentation" });
							}
						}, {
							title: "Modules",
							handle: function() {
								application.services.router.route("articles", { directory: "glue/modules" });
							}
						}]
				}, {
					title: "Modules",
					handle: function() {
						application.services.router.route("articles", { directory: "modules" });
					}
				}, {
					title: "Download",
					handle: function() {
						application.services.router.route("software");
					}
				}, {
					title: "Login",
					handle: function() {
						application.services.router.route("login");
					},
					disabled: function() {
						// currently always disabled
						return true || application.services.vue.loggedIn;
					}
				}
			]
		};
	}
});