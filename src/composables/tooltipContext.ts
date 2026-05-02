import type { InjectionKey } from 'vue'

export interface TooltipContext {
  showTooltip: (target: HTMLElement, text?: string) => void
  hideTooltip: () => void
}

export const tooltipContextKey: InjectionKey<TooltipContext> = Symbol('tooltipContext')
