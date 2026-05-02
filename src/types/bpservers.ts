export type SortKey =
  | 'default'
  | 'whitelist'
  | 'validation'
  | 'country'
  | 'name'
  | 'players'
  | 'version'
  | 'size'
  | 'rank'

export type SortOrder = 'asc' | 'desc'
export type WhitelistFilter = 'any' | 'disabled' | 'enabled'
export type ValidationFilter = 'any' | 'valid' | 'invalid'
export type UpdatedFilter = 'any' | 'current' | 'outdated'

export interface ServerFile {
  Name: string
  Filesize: number
  Hash: string
}

export interface ServerPlugin {
  Name: string
  Description?: string
}

export interface RawServer {
  Name: string
  IP: string
  Port: number
  PlayerCount: number
  PlayerLimit: number
  Whitelist: boolean
  Validation: string
  Version: string
  Location: string
  Rank: number
  Difficulty: string | number
  URL?: string
  Map: ServerFile
  AssetBundles?: ServerFile[]
  Plugins?: ServerPlugin[]
}

export interface Server extends RawServer {
  sanitizedName: string
  TotalAssetsSize: number
  TotalSize: number
  UpToDate: boolean
  Valid: boolean
  CanConnect: boolean
}

export interface Filters {
  whitelist: WhitelistFilter
  validation: ValidationFilter
  updated: UpdatedFilter
  hideEmpty: boolean
  hideFull: boolean
  sorting: SortKey
  sortingOrder: SortOrder
}

export interface CountryInfo {
  name: string
  code: string
  hasFlag: boolean
}

export interface TooltipState {
  visible: boolean
  text: string
  top: number
  left: number
}
