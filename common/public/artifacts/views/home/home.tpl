<template id="home">
	<div class="home" :class="{ 'no-dashboards': !$services.manager.dashboards().length }">
		<div class="dashboards">
			<div v-for="dashboard in $services.manager.dashboards()" class="dashboard" 
				:class="dashboard.alias" :alias="dashboard.alias" :id="getId(dashboard)" 
				v-route-render="dashboard"></div>
		</div>
		<p class="no-dashboards" v-if="!$services.manager.dashboards().length">No dashboards available</p>
	</div>
</template>