<script setup lang="ts">
import type { Server } from '../types/bpservers'
import { getSize, parseColorCodes } from '../utils/format'
import { connectToServer, countryInfo } from '../utils/servers'
import ServerDetails from './ServerDetails.vue'

defineProps<{
	countries: Record<string, string>
	expanded: boolean
	isLast: boolean
	isMobile: boolean
	server: Server
}>()

defineEmits<{
	toggle: [server: Server]
}>()
</script>

<template>
	<tr :class="{
		outdated: !server.UpToDate,
		'last-server': isLast,
		'force-borders': isLast && !expanded,
	}" :title="`Total size: ${getSize(server.TotalSize)}`" @click="$emit('toggle', server)">
		<td :title="server.Whitelist ? 'Whitelist enabled' : 'Whitelist disabled'">
			<i :class="server.Whitelist ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'"></i>
		</td>
		<td :title="server.Valid ? 'Valid' : 'Invalid'">
			<i :class="[server.Valid ? 'fa-solid fa-check valid' : 'fa-solid fa-x invalid']"></i>
		</td>
		<td>
			<img v-if="countryInfo(countries, server.Location).hasFlag" class="icon"
				:src="`https://flagcdn.com/h20/${countryInfo(countries, server.Location).code}.png`"
				:alt="server.Location" :title="countryInfo(countries, server.Location).name" loading="lazy" />
			<span v-else :title="countryInfo(countries, server.Location).name">
				{{ server.Location }}
			</span>
		</td>
		<td class="name"><b v-html="parseColorCodes(server.Name)"></b></td>
		<td>({{ server.PlayerCount }}/{{ server.PlayerLimit }})</td>
		<td v-if="!isMobile">
			<button type="button" class="button" @click.stop="connectToServer(server)">Connect</button>
		</td>
	</tr>

	<tr class="serverInfo" :class="{ show: expanded }">
		<td :colspan="isMobile ? 5 : 6">
			<ServerDetails :server="server" />
		</td>
	</tr>
</template>
