<script setup lang="ts">
defineEmits<{
	refresh: [];
}>();
</script>

<template>
	<section class="title">
		<h1>Error loading the server list, try again later.</h1>
		<button type="button" @click="$emit('refresh')">Refresh</button>
	</section>
</template>
