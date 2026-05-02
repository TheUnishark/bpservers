<script setup lang="ts">
import InfoTooltip from './InfoTooltip.vue'

interface DetailItem {
	id: string
	name: string
	tooltip?: string
}

defineProps<{
	title: string
	items?: DetailItem[]
}>()
</script>

<template>
	<details class="details">
		<summary class="summary">
			<b>{{ title }}</b>
		</summary>
		<div class="details-content">
			<div class="details-inner">
				<span v-for="item in items" :key="item.id">
					{{ item.name }}
					<InfoTooltip :text="item.tooltip" />
				</span>
			</div>
		</div>
	</details>
</template>
