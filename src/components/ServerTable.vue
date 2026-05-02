<script setup lang="ts">
import type { Server } from '../types/bpservers'
import { serverKey } from '../utils/servers'
import ServerRow from './ServerRow.vue'

defineProps<{
	countries: Record<string, string>
	expandedServer: string | null
	isMobile: boolean
	servers: Server[]
}>()

defineEmits<{
	toggleServer: [server: Server]
}>()
</script>

<template>
	<table v-if="servers.length">
		<tbody>
			<template v-for="(server, index) in servers" :key="serverKey(server)">
				<ServerRow :countries="countries" :expanded="expandedServer === serverKey(server)"
					:is-last="index === servers.length - 1" :is-mobile="isMobile" :server="server"
					@toggle="$emit('toggleServer', $event)" />
			</template>
		</tbody>
	</table>
</template>
