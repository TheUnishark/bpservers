export async function useBanList(): Promise<string[]> {
	const response = await fetch('/bpservers/banList.json');
	const banList = (await response.json()) as string[];
	return banList;
}
