import type { VueNode } from '../_util/type.ts'
import type { ColProps } from '../grid'
import type { TooltipProps } from '../tooltip'
import type { RequiredMark } from './Form'
import type { FormLabelAlign } from './interface'
import { clsx } from '@v-c/util'
import { defineComponent } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import useLocale from '../locale/useLocale.ts'
import { useFormContext } from './context.tsx'

export type WrapperTooltipProps = TooltipProps & {
  icon?: any
}

export type LabelTooltipType = WrapperTooltipProps | VueNode

export type ColPropsWithClass = ColProps & { class: string }

export interface FormItemLabelProps {
  colon?: boolean
  htmlFor?: string
  label?: VueNode
  labelAlign?: FormLabelAlign
  labelCol?: ColPropsWithClass
  /**
   * @internal Used for pass `requiredMark` from `<Form />`
   */
  requiredMark?: RequiredMark
  tooltip?: LabelTooltipType
  vertical?: boolean
}

const FormItemLabel = defineComponent<
  FormItemLabelProps & { required?: boolean, prefixCls: string }
>(
  (props, { slots }) => {
    const [formLocale] = useLocale('Form')
    const formContext = useFormContext()
    return () => {
      const {
        labelCol,
        labelAlign,
        prefixCls,
        required,
      } = props
      const {
        labelAlign: contextLabelAlign,
        labelCol: contextLabelCol,
        labelWrap,
        colon: contextColon,
        classes: contextClassNames,
        styles: contextStyles,
      } = formContext.value
      const label = getSlotPropsFnRun(slots, props, 'label')
      if (!label) {
        return null
      }
      const mergedLabelCol: ColPropsWithClass = labelCol || contextLabelCol || {} as ColPropsWithClass
      const mergedLabelAlign: FormLabelAlign = labelAlign || contextLabelAlign
      const labelClsBasic = `${prefixCls}-item-label`
      const labelColClassName = clsx(
        labelClsBasic,
        mergedLabelAlign === 'left' && `${labelClsBasic}-left`,
        mergedLabelCol.class,
        {
          [`${labelClsBasic}-wrap`]: !!labelWrap,
        },
      )
      const labelChildren = label
      // Keep label is original where there should have no colon

      return slots?.default?.()
    }
  },
)
