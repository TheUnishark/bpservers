import type { CountryInfo, RawServer, Server } from '../types/bpservers'

export function prepareServer(raw: RawServer, latestVersion: string): Server {
	const totalAssetsSize =
		raw.AssetBundles?.reduce((total, asset) => total + asset.Filesize, 0) ?? 0
	const upToDate = raw.Version === latestVersion
	const valid = raw.Validation === '+'

	return {
		...raw,
		sanitizedName: raw.Name.replace(/&+[a-f]|&+[0-9]|[^a-z0-9\s]/gi, '').trim(),
		TotalAssetsSize: totalAssetsSize,
		TotalSize: totalAssetsSize + raw.Map.Filesize,
		UpToDate: upToDate,
		Valid: valid,
		CanConnect: upToDate && raw.PlayerCount < raw.PlayerLimit && !raw.Whitelist && valid,
	}
}

export function serverKey(server: Server) {
	return `${server.IP}:${server.Port}`
}

export function rawServerKey(server: RawServer) {
	return `${server.IP}:${server.Port}`
}

export function dedupeServersByAddress(serverList: RawServer[]) {
	const serversByAddress = new Map<string, RawServer>()

	for (const server of serverList) {
		const key = rawServerKey(server)
		if (!serversByAddress.has(key)) serversByAddress.set(key, server)
	}

	return [...serversByAddress.values()]
}

export function serverUrl(server: Server) {
	if (!server.URL) return ''
	return server.URL.startsWith('http') ? server.URL : `https://${server.URL}`
}

export function countryInfo(countries: Record<string, string>, code: string): CountryInfo {
	const urlCode = code.toLocaleLowerCase()

	return {
		code: urlCode,
		name: countries[urlCode] ?? code,
		hasFlag: Boolean(countries[urlCode]),
	}
}

export function connectToServer(server: Server) {
	const date = new Date()
	if (date.getDate() === 1 && date.getMonth() === 3) {
		window.location.href = 'steam://open/bigpicture'
		return
	}

	window.location.href = `steam://run/696370//-connect ${server.IP}:${server.Port}/`
}
