import { colorCodes } from '../constants/bpservers'

export function escapeHtml(value: string) {
  const replacements: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return value.replace(/[&<>"']/g, (char) => replacements[char])
}

export function parseColorCodes(value: string) {
  let escaped = escapeHtml(value)
  const regex = /&amp;+([a-f0-9])/i
  let hasPrevious = false

  while (regex.test(escaped)) {
    const color = escaped.match(regex)?.[1].toLowerCase() ?? 'f'
    escaped = escaped.replace(
      regex,
      `${hasPrevious ? '</span>' : ''}<span style="color:#${colorCodes[color]}">`,
    )
    hasPrevious = true
  }

  return hasPrevious ? `${escaped}</span>` : escaped
}

export function formatNews(value: string) {
  return escapeHtml(value)
    .replace(/\n/g, '<br>')
    .replace(/&lt;color=#([A-Fa-f0-9]{6})&gt;(.*?)&lt;\/color&gt;/g, '<b style="color:#$1">$2</b>')
}

export function getSize(size: number) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB']
  let unit = 0
  let divided = size

  while (divided >= 1000 && unit < units.length - 1) {
    unit += 1
    divided /= 1000
  }

  const rounded = Math.round((divided + Number.EPSILON) * 100) / 100
  return `${rounded} ${units[unit]}`
}
