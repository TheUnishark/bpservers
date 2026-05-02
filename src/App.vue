<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import AppBackground from './components/AppBackground.vue';
import AppHeader from './components/AppHeader.vue';
import ErrorState from './components/ErrorState.vue';
import LoadingIndicator from './components/LoadingIndicator.vue';
import NewsModal from './components/NewsModal.vue';
import ServerFilters from './components/ServerFilters.vue';
import ServerTable from './components/ServerTable.vue';
import TooltipOverlay from './components/TooltipOverlay.vue';
import { tooltipContextKey } from './composables/tooltipContext';
import { useServerList } from './composables/useServerList';
import { useViewport } from './composables/useViewport';
import type { Server, TooltipState } from './types/bpservers';
import { serverKey } from './utils/servers';

const {
	countries,
	filteredServers,
	filters,
	loadError,
	loading,
	loadFilters,
	playerCount,
	reload,
	updateNotes,
	version,
} = useServerList();

const { isMobile } = useViewport();

const expandedServer = ref<string | null>(null);
const newsOpen = ref(false);
const tooltip = ref<TooltipState>({
	visible: false,
	text: 'No description.',
	top: 0,
	left: 0,
});

provide(tooltipContextKey, {
	showTooltip(target, text) {
		const rect = target.getBoundingClientRect();

		tooltip.value = {
			visible: true,
			text: text || 'No description.',
			top: rect.top + window.scrollY + rect.height / 2,
			left: rect.left + rect.width + 5,
		};
	},
	hideTooltip() {
		tooltip.value.visible = false;
	},
});

onMounted(() => {
	loadFilters();
	void reload();
});

function refresh() {
	expandedServer.value = null;
	void reload();
}

function toggleServer(server: Server) {
	const key = serverKey(server);
	expandedServer.value = expandedServer.value === key ? null : key;
}
</script>

<template>
	<AppBackground />
	<TooltipOverlay :tooltip="tooltip" />

	<main>
		<LoadingIndicator v-if="loading" />

		<ErrorState v-if="loadError" @refresh="refresh" />

		<template v-else>
			<AppHeader
				:player-count="playerCount"
				:server-count="filteredServers.length"
				:version="version"
				@open-news="newsOpen = true"
				@refresh="refresh"
			/>

			<ServerFilters v-model="filters" />

			<ServerTable
				:countries="countries"
				:expanded-server="expandedServer"
				:is-mobile="isMobile"
				:servers="filteredServers"
				@toggle-server="toggleServer"
			/>
		</template>
	</main>

	<NewsModal
		v-if="newsOpen"
		:update-notes="updateNotes"
		@close="newsOpen = false"
	/>
</template>
