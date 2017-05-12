if (!application) { var application = {} };
if (!application.definitions) { application.definitions = {} }

application.definitions.Swagger = function swagger($services) {
	this.$initialize = function() {
		return new nabu.services.SwaggerClient({ definition: ${nabu.management.core.swagger(environment("webApplicationId"))/swagger} });
	}
}