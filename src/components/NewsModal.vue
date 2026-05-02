<script setup lang="ts">
import { computed } from 'vue'
import { formatNews } from '../utils/format'

const props = defineProps<{
	updateNotes: string
}>()

defineEmits<{
	close: []
}>()

const formattedNews = computed(() => formatNews(props.updateNotes))
</script>

<template>
	<div class="modal-background" @click="$emit('close')"></div>
	<section class="modal" role="dialog" aria-modal="true" aria-label="News">
		<h2>News</h2>
		<div class="modal-content" v-html="formattedNews"></div>
		<i class="fa-sharp fa-solid fa-xmark close" role="button" tabindex="0" aria-label="Close" @click="$emit('close')" @keydown.enter="$emit('close')" @keydown.space.prevent="$emit('close')"></i>
	</section>
</template>
