import type { App, SlotsType } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, WarningFilled } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { createVNode, defineComponent } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useBaseConfig } from '../config-provider/context.ts'
import noFound from './noFound'
import serverError from './serverError'
import useStyle from './style'
import unauthorized from './unauthorized'

export const IconMap = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled,
}

export const ExceptionMap = {
  404: noFound,
  500: serverError,
  403: unauthorized,
}

export type ExceptionStatusType = 403 | 404 | 500 | '403' | '404' | '500'
export type ResultStatusType = ExceptionStatusType | keyof typeof IconMap

export interface ResultProps extends ComponentBaseProps {
  icon?: VueNode
  status?: ResultStatusType
  title?: VueNode
  subTitle?: VueNode
  extra?: VueNode
}

// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap)

/**
 * Render icon if ExceptionStatus includes ,render svg image else render iconNode
 *
 * @param prefixCls
 * @param {status, icon}
 */

interface IconProps {
  prefixCls: string
  icon: VueNode
  status: ResultStatusType
}
const defaultIconProps = {
  icon: undefined,
} as any

const Icon = defineComponent<IconProps>(
  (props = defaultIconProps, { slots }) => {
    return () => {
      const { prefixCls, status } = props
      const icon = getSlotPropsFnRun(slots, props, 'icon', false)
      const className = classNames(`${prefixCls}-icon`)
      if (ExceptionStatus.includes(`${status}`)) {
        const SVGComponent = ExceptionMap[status as ExceptionStatusType]
        return (
          <div class={`${className} ${prefixCls}-image`}>
            <SVGComponent />
          </div>
        )
      }
      const iconNode = createVNode(
        IconMap[status as Exclude<ResultStatusType, ExceptionStatusType>],
      )
      if (icon === null || icon === false) {
        return null
      }

      return <div class={className}>{icon || iconNode}</div>
    }
  },
)

interface ExtraProps {
  prefixCls: string
  extra: VueNode
}

const defaultExtraProps = {
  extra: undefined,
} as any

const Extra = defineComponent<ExtraProps>(
  (props = defaultExtraProps, { slots }) => {
    return () => {
      const { prefixCls } = props
      const extra = getSlotPropsFnRun(slots, props, 'extra')
      if (!extra) {
        return null
      }
      return <div class={`${prefixCls}-extra`}>{extra}</div>
    }
  },
)

export interface ResultSlots {
  icon?: () => any
  title?: () => any
  subTitle?: () => any
  extra?: () => any
  default?: () => any
}

const defaultResultProps = {
  icon: undefined,
  status: 'info',
  title: undefined,
  subTitle: undefined,
  extra: undefined,
} as any

const Result = defineComponent<
  ResultProps,
  Record<string, any>,
  string,
  SlotsType<ResultSlots>
>(
  (props = defaultResultProps, { slots, attrs }) => {
    const { prefixCls, direction, result } = useBaseConfig('result', props)
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

    return () => {
      const { status, rootClass } = props
      const className = classNames(
        prefixCls.value,
        `${prefixCls.value}-${status}`,
        (attrs as any).class,
        result?.value?.class,
        rootClass,
        { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
        hashId.value,
        cssVarCls.value,
      )
      const subTitle = getSlotPropsFnRun(slots, props, 'subTitle')
      const title = getSlotPropsFnRun(slots, props, 'title')
      const extra = getSlotPropsFnRun(slots, props, 'extra')
      const icon = getSlotPropsFnRun(slots, props, 'icon', false)
      const children = filterEmpty(slots?.default?.())
      const mergedStyle = [result?.value?.style, (attrs as any).style]

      return wrapCSSVar(
        <div class={className} style={mergedStyle}>
          <Icon prefixCls={prefixCls.value} status={status!} icon={icon} />
          <div class={`${prefixCls.value}-title`}>{title}</div>
          {!!subTitle && <div class={`${prefixCls.value}-subtitle`}>{subTitle}</div>}
          <Extra prefixCls={prefixCls.value} extra={extra} />
          {!!children.length && <div class={`${prefixCls.value}-content`}>{children}</div>}
        </div>,
      )
    }
  },
  {
    name: 'AResult',
    inheritAttrs: false,
  },
)

;(Result as any).PRESENTED_IMAGE_403 = ExceptionMap['403']
;(Result as any).PRESENTED_IMAGE_404 = ExceptionMap['404']
;(Result as any).PRESENTED_IMAGE_500 = ExceptionMap['500']
;(Result as any).install = (app: App) => {
  app.component(Result.name, Result)
}

export default Result as typeof Result & {
  PRESENTED_IMAGE_403: typeof ExceptionMap['403']
  PRESENTED_IMAGE_404: typeof ExceptionMap['404']
  PRESENTED_IMAGE_500: typeof ExceptionMap['500']
}
