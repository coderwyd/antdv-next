import type { AriaAttributes } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ComponentBaseProps } from '../config-provider/context.ts'

export type SemanticName = 'root' | 'body' | 'rail' | 'track' | 'indicator'

export type ProgressClassNamesType = SemanticClassNamesType<ProgressProps, SemanticName>

export type ProgressStylesType = SemanticStylesType<ProgressProps, SemanticName>

export const ProgressTypes = ['line', 'circle', 'dashboard'] as const
export type ProgressType = (typeof ProgressTypes)[number]
const ProgressStatuses = ['normal', 'exception', 'active', 'success'] as const
export type ProgressSize = 'default' | 'small'
export type StringGradients = Record<string, string>
interface FromToGradients { from: string, to: string }
export type ProgressGradient = { direction?: string } & (StringGradients | FromToGradients)
export interface PercentPositionType {
  align?: 'start' | 'center' | 'end'
  type?: 'inner' | 'outer'
}

export interface SuccessProps {
  percent?: number
  strokeColor?: string
}

export type ProgressAriaProps = Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'>

export type GapPlacement = 'top' | 'bottom' | 'start' | 'end'
export type GapPosition = 'top' | 'bottom' | 'left' | 'right'

export interface ProgressProps extends ComponentBaseProps, ProgressAriaProps {
  classes?: ProgressClassNamesType
  styles?: ProgressStylesType
  type?: ProgressType
  percent?: number
  format?: (params: { percent?: number, successPercent?: number }) => any
  status?: (typeof ProgressStatuses)[number]
  showInfo?: boolean
  strokeWidth?: number
  strokeLinecap?: 'butt' | 'square' | 'round'
  strokeColor?: string | string[] | ProgressGradient
  /** @deprecated Please use `railColor` instead */
  trailColor?: string
  railColor?: string
  /** @deprecated Use `size` instead */
  width?: number
  success?: SuccessProps
  gapDegree?: number
  gapPlacement?: GapPlacement
  /** @deprecated please use `gapPlacement` instead */
  gapPosition?: GapPosition
  size?: number | [number | string, number] | ProgressSize | { width?: number, height?: number }
  steps?: number | { count: number, gap: number }
  percentPosition?: PercentPositionType
  rounding?: (step: number) => number
}
