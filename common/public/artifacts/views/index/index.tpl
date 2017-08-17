<template id="index">
	<div class="index">
		<div class="menu">
			<a href="javascript:void(0)" @click="$services.router.route('home')" class="name"><span>Management</span></a><n-menu-dropdown :actions="$services.manager.menus()" class="menu"/>
			<div class="icons">
				<div class="quickmenu" v-show="$services.manager.quickmenu().length">
					<button v-for="button in $services.manager.quickmenu()" @click="button.handler ? button.handler($event) : $services.router.route(button.route)"><span class="n-icon" :class="button.class"></span>{{ button.title }}</button>
				</div>
				<n-table-view
				/><n-connection/>
			</div>
		</div>
		<div id="main"></div>
	</div>
</template>