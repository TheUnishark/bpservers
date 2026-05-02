<script setup lang="ts">
import type { Server } from '../types/bpservers'
import { getSize, parseColorCodes } from '../utils/format'
import { serverUrl } from '../utils/servers'
import InfoTooltip from './InfoTooltip.vue'
import ServerDetailsGroup from './ServerDetailsGroup.vue'

const props = defineProps<{
	server: Server
}>()

const pluginItems = props.server.Plugins?.map((plugin) => ({
	id: plugin.Name,
	name: plugin.Name,
	tooltip: plugin.Description,
}))

const assetItems = props.server.AssetBundles?.map((asset) => ({
	id: asset.Hash,
	name: asset.Name,
	tooltip: `Filesize: ${getSize(asset.Filesize)}\nHash: ${asset.Hash}`,
}))
</script>

<template>
	<div class="info">
		<div class="inner">
			<div>
				<b>Map:</b> {{ server.Map.Name }}
				<InfoTooltip :text="`Filesize: ${getSize(server.Map.Filesize)}\nHash: ${server.Map.Hash}`" />
			</div>
			<div>
				<b>Version:</b>
				<span v-html="parseColorCodes(`${server.UpToDate ? '&2' : '&4'}${server.Version}`)"></span>
			</div>
			<div><b>IP:</b> {{ server.IP }}:{{ server.Port }}</div>
			<div><b>Rank:</b> {{ server.Rank }}</div>
			<div><b>Difficulty:</b> {{ Number(server.Difficulty) * 100 }}%</div>
			<div v-if="server.URL">
				<b>URL:</b>
				<a :href="serverUrl(server)" target="_blank" rel="noreferrer">
					{{ server.URL }}
				</a>
			</div>

			<ServerDetailsGroup :items="pluginItems" :title="`Plugins (${server.Plugins?.length ?? 0}):`" />
			<ServerDetailsGroup :items="assetItems" :title="`Asset Bundles (${server.AssetBundles?.length ?? 0}) [${getSize(server.TotalAssetsSize)}]:`" />
		</div>
	</div>
</template>
