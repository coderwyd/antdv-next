import type { SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext.tsx'
import type { ColProps } from '../grid'
import type { FormContextProps } from './context.tsx'
import type { FormLabelAlign, ScrollFocusOptions } from './interface'
import type { InternalNamePath, ValidateErrorEntity, ValidateMessages } from './types.ts'
import { clsx } from '@v-c/util'
import { pick } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext, useDisabledContextProvider } from '../config-provider/DisabledContext.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import { useSizeProvider } from '../config-provider/SizeContext.tsx'
import { NoFormStyle, useFormContextProvider, useVariantContextProvider } from './context.tsx'
import useStyle from './style'
import { useValidateMessagesContext } from './validateMessagesContext.tsx'

export type RequiredMark
  = | boolean
    | 'optional'
    | ((labelNode: any, info: { required: boolean }) => any)
export type FormLayout = 'horizontal' | 'inline' | 'vertical'
export type FormItemLayout = 'horizontal' | 'vertical'

export type { ScrollFocusOptions }

export type FormSemanticName = 'root' | 'label' | 'content'

export type FormClassNamesType = SemanticClassNamesType<FormProps, FormSemanticName>
export type FormStylesType = SemanticStylesType<FormProps, FormSemanticName>

export interface FormProps extends ComponentBaseProps {
  classes?: FormClassNamesType
  styles?: FormStylesType
  colon?: boolean
  name?: string
  layout?: FormLayout
  labelAlign?: FormLabelAlign
  labelWrap?: boolean
  labelCol?: ColProps
  wrapperCol?: ColProps
  // feedbackIcons?:Fe
  size?: SizeType
  disabled?: boolean
  scrollToFirstError?: ScrollFocusOptions | boolean
  requiredMark?: RequiredMark
  variant?: Variant
  validateMessages?: ValidateMessages
}

export interface FormEmits {
  finishFailed: (errorInfo: ValidateErrorEntity) => void
  reset: (e: Event) => void
  [key: string]: (...args: any[]) => void
}

export interface FormSlots {
  default: () => any
}
const defaults = {
  layout: 'horizontal',
} as any
const InternalForm = defineComponent<
  FormProps,
  FormEmits,
  string,
  SlotsType<FormSlots>
>(
  (props = defaults, { slots, expose, emit, attrs }) => {
    const contextDisabled = useDisabledContext()
    const {
      prefixCls,
      direction,
      requiredMark: contextRequiredMark,
      colon: contextColon,
      scrollToFirstError: contextScrollToFirstError,
      class: contextClassName,
      style: contextStyle,
      styles: contextStyles,
      classes: contextClassNames,
    } = useComponentBaseConfig('form', props, ['scrollToFirstError', 'colon', 'requiredMark'])
    const { size, styles, classes, variant } = toPropsRefs(props, 'size', 'classes', 'styles', 'variant')
    const mergedSize = useSize(size)
    const disabled = computed(() => props?.disabled ?? contextDisabled.value)
    const contextValidateMessages = useValidateMessagesContext()

    const mergedRequiredMark = computed(() => {
      if (props.requiredMark !== undefined) {
        return props.requiredMark
      }
      if (contextRequiredMark.value !== undefined) {
        return contextRequiredMark.value
      }
      return true
    })

    const mergedColon = computed(() => props.colon ?? contextColon.value)

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        colon: mergedColon.value,
        requiredMark: mergedRequiredMark.value,
      } as FormProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      FormClassNamesType,
      FormStylesType,
      FormProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const formContextValue = computed(() => {
      return {
        ...pick(props, ['name', 'labelAlign', 'labelCol', 'labelWrap', 'wrapperCol', 'layout']),
        colon: mergedColon.value,
        requiredMark: mergedRequiredMark.value,
        classes: mergedClassNames.value,
        styles: mergedStyles.value,
      } as FormContextProps
    })

    const nativeElementRef = shallowRef<HTMLFormElement>()

    const scrollToField = (options: ScrollFocusOptions | boolean, fieldName: InternalNamePath) => {
      if (options) {
        let defaultScrollToFirstError: ScrollFocusOptions = { block: 'nearest' }
        if (typeof options === 'object') {
          defaultScrollToFirstError = { ...defaultScrollToFirstError, ...options }
        }
        // 滚动到指定的元素
      }
    }

    const onInternalFinishFailed = (errorInfo: ValidateErrorEntity) => {
      emit('finishFailed', errorInfo)
      // TODO
    }
    // 注入一下finishFailed
    expose({
      nativeElement: nativeElementRef,
    })
    useFormContextProvider(formContextValue)
    useVariantContextProvider(variant)
    useDisabledContextProvider(disabled)
    useSizeProvider(mergedSize)

    const handleSubmit = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      // submit提交
    }

    const handleReset = (e: Event) => {
      e.preventDefault()
      emit('reset', e)
      // reset重置
    }

    return () => {
      const {
        layout,
        rootClass,
        name,
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const formClassName = clsx(
        prefixCls.value,
        `${prefixCls.value}-${layout}`,
        {
          [`${prefixCls.value}-hide-required-mark`]: mergedRequiredMark.value === false, // todo: remove in next major version
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value,
        },
        cssVarCls.value,
        rootCls.value,
        hashId.value,
        contextClassName.value,
        className,
        rootClass,
        mergedClassNames.value.root,
      )
      return (
        <NoFormStyle status>
          <form
            id={name}
            {...restAttrs}
            name={name}
            ref={nativeElementRef}
            style={[mergedStyles.value.root, contextStyle.value, style]}
            class={formClassName}
            onSubmit={handleSubmit}
            onReset={handleReset}
          >
            {slots?.default?.()}
          </form>
        </NoFormStyle>
      )
    }
  },
  {
    name: 'AForm',
    inheritAttrs: false,
  },
)

export default InternalForm
