<template id="index">
	<div class="index">
		<div class="menu">
			<a href="javascript:void(0)" @click="$services.router.route('home')" class="name"><span>Management</span></a><n-menu-dropdown :actions="$services.manager.menus()" class="menu"/>
		</div>
		<div id="main"></div>
	</div>
</template>