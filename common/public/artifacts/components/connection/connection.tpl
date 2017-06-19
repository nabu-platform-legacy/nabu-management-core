<template id="connection">
	<div class="connection" v-auto-close="function() { showing = false }">
		<button v-show="connections.length" @click="showing = !showing" class="info"><span class="n-icon n-icon-database"></span>{{ $services.manager.connection() }}</button>
		<ul v-if="showing" class="page-menu">
			<li auto-close v-for="connection in connections" :class="{'active': $services.manager.connection() == connection }">
				<a href="javascript:void(0)" @click="$services.manager.connection(connection)">{{ connection }}</a>
			</li>
		</ul>
	</div>
</template>