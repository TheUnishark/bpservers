<script setup lang="ts">
import { inject } from 'vue';
import { tooltipContextKey } from '../composables/tooltipContext';

const props = defineProps<{
	text?: string;
}>();

const tooltip = inject(tooltipContextKey);

function show(event: MouseEvent | FocusEvent) {
	tooltip?.showTooltip(event.currentTarget as HTMLElement, props.text);
}
</script>

<template>
	<i
		class="fa-solid fa-circle-info info-tooltip"
		tabindex="0"
		@mouseenter="show"
		@mouseleave="tooltip?.hideTooltip"
		@focus="show"
		@blur="tooltip?.hideTooltip"
	/>
</template>
