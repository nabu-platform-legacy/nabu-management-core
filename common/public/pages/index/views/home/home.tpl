<template id="home">
	<h1>Nabu Management</h1>
	<div v-for="row in $application.services.vue.row">
		<div v-for="dashboard in getRow(row)" class="dashboard" :alias="dashboard.alias" :id="getId(dashboard)"></div>
	</div>
</template>