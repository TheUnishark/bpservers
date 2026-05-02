import type { RawServer } from '../types/bpservers'

const proxyBaseUrl = 'https://bpservers-proxy.onrender.com'

async function getText(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed: ${url}`)
  return response.text()
}

export function getVersion() {
  return getText(`${proxyBaseUrl}/version`)
}

export function getNews() {
  return getText(`${proxyBaseUrl}/news`)
}

export async function getServers() {
  const response = await fetch(`${proxyBaseUrl}/servers`)
  if (!response.ok) throw new Error('Request failed: servers')
  return (await response.json()) as RawServer[]
}

export async function getCountries() {
  const response = await fetch('https://flagcdn.com/en/codes.json')
  if (!response.ok) throw new Error('Request failed: countries')
  return (await response.json()) as Record<string, string>
}
