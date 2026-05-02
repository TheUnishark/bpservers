<script setup lang="ts">
import type { TooltipState } from '../types/bpservers';

defineProps<{
	tooltip: TooltipState;
}>();
</script>

<template>
	<div
		id="tooltip"
		:class="{ fadeIn: tooltip.visible }"
		:style="{ top: `${tooltip.top}px`, left: `${tooltip.left}px` }"
	>
		{{ tooltip.text }}
	</div>
</template>
