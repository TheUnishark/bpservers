<script setup lang="ts">
defineProps<{
	version: string;
	playerCount: number;
	serverCount: number;
}>();

defineEmits<{
	refresh: [];
	openNews: [];
}>();
</script>

<template>
	<header class="title">
		<h1>
			Broke Protocol Server List - Current Version:
			<span
				class="news"
				role="button"
				tabindex="0"
				title="Update Notes"
				@click="$emit('openNews')"
				@keydown.enter="$emit('openNews')"
				@keydown.space.prevent="$emit('openNews')"
			>
				{{ version || '...' }}
			</span>
		</h1>
		<button type="button" @click="$emit('refresh')">Refresh</button>
	</header>

	<h2 class="subtitle">
		<span>{{ playerCount }}</span>
		Players on
		<span>{{ serverCount }}</span>
		servers:
	</h2>
</template>
