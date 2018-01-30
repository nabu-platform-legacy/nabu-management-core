<template id="n-confirm">
	<div class="n-confirm">
		<div v-if="type" class="n-confirm-icon"><span class="info n-icon" :class="{'n-icon-question-circle-o': type == 'question', 'n-icon-exclamation-triangle': type == 'warning', 'n-icon-exclamation-circle': type == 'error', 'n-icon-info-circle': type == 'info' }"></span></div>
		<div class="n-confirm-content"><slot>{{ message }}</slot></div>
		<div class="n-confirm-buttons">
			<a href="javascript:void(0)" @click="$reject()">{{ cancel ? cancel : '%{Cancel}' }}</a>
			<button class="info" @click="$resolve()">{{ ok ? ok : '%{Ok}' }}</button>
		</div>
	</div>
</template>