import { computed, ref, watch } from 'vue';
import { appName, defaultFilters } from '../constants/bpservers';
import {
	getCountries,
	getNews,
	getServers,
	getVersion,
} from '../services/bpserversApi';
import type { Filters, Server } from '../types/bpservers';
import {
	dedupeServersByAddress,
	prepareServer,
	isIpInRange,
} from '../utils/servers';
import { useBanList } from './useBanList';

export function useServerList() {
	const filters = ref<Filters>({ ...defaultFilters });
	const servers = ref<Server[]>([]);
	const version = ref('');
	const updateNotes = ref('');
	const countries = ref<Record<string, string>>({});
	const banList = ref<string[]>([]);
	const loading = ref(false);
	const loadError = ref(false);

	const filteredServers = computed(() => {
		const filtered = servers.value.filter((server) => {
			const whitelist = filters.value.whitelist === 'enabled';
			const validation = filters.value.validation === 'valid' ? '+' : '!';
			const updated = filters.value.updated === 'current';

			if (filters.value.whitelist !== 'any' && server.Whitelist !== whitelist)
				return false;
			if (
				filters.value.validation !== 'any' &&
				server.Validation !== validation
			)
				return false;
			if (
				filters.value.updated !== 'any' &&
				((updated && !server.UpToDate) || (!updated && server.UpToDate))
			) {
				return false;
			}
			if (filters.value.hideEmpty && server.PlayerCount < 1) return false;
			if (filters.value.hideFull && server.PlayerCount >= server.PlayerLimit)
				return false;
			if (filters.value.banList && banList.value.length) {
				if (banList.value.some((ip) => isIpInRange(server.IP, ip)))
					return false;
			}
			return true;
		});

		const sorted = [...filtered];
		const desc = filters.value.sortingOrder === 'desc';

		switch (filters.value.sorting) {
			case 'country':
				sorted.sort((a, b) => a.Location.localeCompare(b.Location));
				break;
			case 'name':
				sorted.sort((a, b) => a.sanitizedName.localeCompare(b.sanitizedName));
				break;
			case 'players':
				sorted.sort((a, b) => a.PlayerCount - b.PlayerCount);
				break;
			case 'version':
				sorted.sort((a, b) => a.Version.localeCompare(b.Version));
				break;
			case 'validation':
				sorted.sort((a, b) => Number(a.Valid) - Number(b.Valid));
				break;
			case 'whitelist':
				sorted.sort((a, b) => Number(a.Whitelist) - Number(b.Whitelist));
				break;
			case 'size':
				sorted.sort((a, b) => a.TotalSize - b.TotalSize);
				break;
			case 'rank':
				sorted.sort((a, b) => a.Rank - b.Rank);
				break;
			default:
				break;
		}

		return desc ? sorted.reverse() : sorted;
	});

	const playerCount = computed(() =>
		filteredServers.value.reduce(
			(total, server) => total + server.PlayerCount,
			0,
		),
	);

	watch(
		filters,
		(value) => {
			localStorage.setItem('filters', JSON.stringify(value));
		},
		{ deep: true },
	);

	function loadFilters() {
		const savedFilters = localStorage.getItem('filters');
		if (!savedFilters) return;

		try {
			filters.value = {
				...defaultFilters,
				...(JSON.parse(savedFilters) as Partial<Filters>),
			};
		} catch {
			filters.value = { ...defaultFilters };
		}
	}

	async function reload() {
		loading.value = true;
		loadError.value = false;
		document.title = `${appName} (Loading...)`;

		try {
			const [latestVersion, news, serverList, countryList, banListData] =
				await Promise.all([
					getVersion(),
					getNews(),
					getServers(),
					getCountries().catch((error) => {
						console.error(error);
						return {};
					}),
					useBanList(),
				]);

			version.value = latestVersion.replace(/(\r\n|\n|\r)/gm, '');
			updateNotes.value = news;
			countries.value = countryList;
			banList.value = banListData;
			servers.value = dedupeServersByAddress(serverList).map((server) =>
				prepareServer(server, version.value),
			);
			document.title = appName;
		} catch (error) {
			console.error(error);
			loadError.value = true;
			document.title = `${appName} (Error)`;
		} finally {
			loading.value = false;
		}
	}

	return {
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
	};
}
