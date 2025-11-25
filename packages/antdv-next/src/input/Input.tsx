import type { InputProps as VcInputProps } from '@v-c/input'
import type { SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import { computed, defineComponent, shallowRef } from 'vue'
import {

  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { getMergedStatus } from '../_util/statusUtils'
import { toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../form/context.tsx'
import { useCompactItemContext } from '../space/Compact'
import useStyle, { useSharedStyle } from './style'

type SemanticName = 'root' | 'prefix' | 'suffix' | 'input' | 'count'

export type InputClassNamesType = SemanticClassNamesType<InputProps, SemanticName>
export type InputStylesType = SemanticStylesType<InputProps, SemanticName>
interface BaseVcInputProps {
  value?: any
  defaultValue?: any
  type?: VcInputProps['type']
  showCount?: VcInputProps['showCount']
  autoComplete?: string
  htmlSize?: number
  placeholder?: string
  count?: VcInputProps['count']
  maxLength?: number
  readonly?: boolean
  hidden?: boolean
  dataAttrs?: VcInputProps['dataAttrs']
  components?: VcInputProps['components']
  prefix?: VueNode
  suffix?: VueNode
  allowClear?: VcInputProps['allowClear']
}

export interface InputProps extends ComponentBaseProps, BaseVcInputProps {
  size?: SizeType
  disabled?: boolean
  status?: InputStatus
  /**
   * @deprecated Use `Space.Compact` instead.
   *
   * @example
   * ```tsx
   * import { Space, Input } from 'antd';
   *
   * <Space.Compact>
   *   {addon}
   *   <Input defaultValue="name" />
   * </Space.Compact>
   * ```
   */
  addonBefore?: VueNode

  /**
   * @deprecated Use `Space.Compact` instead.
   *
   * @example
   * ```tsx
   * import { Space, Input } from 'antd';
   *
   * <Space.Compact>
   *   <Input defaultValue="name" />
   *   {addon}
   * </Space.Compact>
   * ```
   */
  addonAfter?: VueNode

  /** @deprecated Use `variant="borderless"` instead. */
  bordered?: boolean
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant
  classes?: InputClassNamesType
  styles?: InputStylesType
}

export interface InputEmits {
  pressEnter: (e: Event) => void
  clear: () => void
  change: NonNullable<VcInputProps['onChange']>
  blur: NonNullable<VcInputProps['onBlur']>
  focus: NonNullable<VcInputProps['onFocus']>
  keydown: NonNullable<VcInputProps['onKeyDown']>
  keyup: NonNullable<VcInputProps['onKeyUp']>
  compositionStart: NonNullable<VcInputProps['onCompositionStart']>
  compositionEnd: NonNullable<VcInputProps['onCompositionEnd']>
  [key: string]: (...args: any[]) => any
}

export interface InputSlots {
  prefix: () => any
  suffix: () => any
  addonBefore: () => any
  addonAfter: () => any
  default: () => any
  clearIcon: () => any
}

const Input = defineComponent<
  InputProps,
  InputEmits,
  string,
  SlotsType<InputSlots>
>(
  (props, { slots, expose, emit, attrs }) => {
    const {
      prefixCls,
      direction,
      allowClear: contextAllowClear,
      autoComplete: contextAutoComplete,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig(
      'input',
      props,
      ['allowClear', 'autoComplete'],
    )
    const {
      classes,
      styles,
      rootClass,
      size: customSize,
      disabled: customDisabled,
      status: customStatus,
    } = toPropsRefs(
      props,
      'classes',
      'styles',
      'rootClass',
      'size',
      'disabled',
      'status',
    )
    const inputRef = shallowRef()

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useSharedStyle(prefixCls, rootClass)
    useStyle(prefixCls, rootCls)

    // ===================== Compact Item =====================
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)

    // ===================== Size =====================
    const mergedSize = useSize(ctx => customSize.value ?? compactSize.value ?? ctx)

    // ===================== Disabled =====================
    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabled.value)

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
      } as InputProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      InputClassNamesType,
      InputStylesType,
      InputProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    // ===================== Status =====================
    const formItemInputContext = useFormItemInputContext()
    const contextStatus = computed(() => formItemInputContext.value.status)
    const hasFeedback = computed(() => formItemInputContext.value.hasFeedback)
    const feedbackIcon = computed(() => formItemInputContext.value.feedbackIcon)
    const mergedStatus = computed(() => getMergedStatus(contextStatus.value, customStatus.value))
    return () => {
      return null
    }
  },
  {
    name: 'AInput',
    inheritAttrs: false,
  },
)

export default Input
