<template id="n-messages">
	<div class="n-component n-messages">
		<div class="n-message" v-for="message in messages" :class="'n-message-severity-' + message.severity" :code="message.code" @mouseover="highlight(message)" @mouseout="unhighlight(message)">
			<slot message="message">
				<span class="title">{{ message.title ? format(message.title, message.values, message.context) : message.code }}</span>
				<span class="description" v-if="message.description">{{ format(message.description, message.values, message.context) }}</span>
			</slot>
		</div>
	</div>
</template>