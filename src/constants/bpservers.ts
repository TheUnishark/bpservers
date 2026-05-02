import type { Filters, SortKey } from '../types/bpservers'

export const appName = 'BP Server List'

export const defaultFilters: Filters = {
  whitelist: 'any',
  validation: 'any',
  updated: 'any',
  hideEmpty: false,
  hideFull: false,
  sorting: 'default',
  sortingOrder: 'asc',
}

export const sortOptions: Record<SortKey, string> = {
  default: 'Default',
  whitelist: 'Whitelist',
  validation: 'Validation',
  country: 'Country',
  name: 'Name',
  players: 'Players',
  version: 'Version',
  size: 'Server Size',
  rank: 'Rank',
}

export const colorCodes: Record<string, string> = {
  '0': '000000',
  '1': '0000AA',
  '2': '00AA00',
  '3': '00AAAA',
  '4': 'AA0000',
  '5': 'AA00AA',
  '6': 'FFAA00',
  '7': 'AAAAAA',
  '8': '555555',
  '9': '5555FF',
  a: '55FF55',
  b: '55FFFF',
  c: 'FF5555',
  d: 'FF55FF',
  e: 'FFFF55',
  f: 'FFFFFF',
}
