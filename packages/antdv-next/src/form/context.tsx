import type { Key } from '@v-c/util/dist/type'
import type { InjectionKey, Ref } from 'vue'
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks'
import type { Variant } from '../config-provider/context'
import type { FormLayout, FormSemanticName, RequiredMark } from './Form'
import type { ValidateStatus } from './FormItem'
import type { ColPropsWithClass } from './FormItemLabel.tsx'
import type { FormLabelAlign } from './interface'
import type { Meta, NamePath } from './types.ts'
import { computed, defineComponent, inject, provide, ref } from 'vue'

/** Form Context. Set top form style and pass to Form Item usage. */
export interface FormContextProps {
  classes?: SemanticClassNames<FormSemanticName>
  styles?: SemanticStyles<FormSemanticName>
  layout: FormLayout
  name?: string
  colon?: boolean
  labelAlign?: FormLabelAlign
  labelWrap?: boolean
  labelCol?: ColPropsWithClass
  wrapperCol?: ColPropsWithClass
  requiredMark?: RequiredMark
  // itemRef: (name: (string | number)[]) => (node: React.ReactElement) => void;
  // form?: FormInstance;
  // feedbackIcons?: FeedbackIcons;
}

const FormContextKey = Symbol('FormContextKey')

export function useFormContextProvider(value: Ref<FormContextProps>) {
  provide(FormContextKey, value)
}

export function useFormContext() {
  return inject(FormContextKey, ref({
    labelAlign: 'right',
    layout: 'horizontal',
  } as FormContextProps))
}

const FormItemPrefixContextKey: InjectionKey<Ref<FormItemPrefixContextProps>> = Symbol('FormItemPrefixContextKey')

/** Used for ErrorList only */
export interface FormItemPrefixContextProps {
  prefixCls: string
  status?: ValidateStatus
}

export function useFormItemPrefixContextProvider(value: Ref<FormItemPrefixContextProps>) {
  provide(FormItemPrefixContextKey, value)
}

export function useFormItemPrefixContext() {
  return inject(FormItemPrefixContextKey, ref({
    prefixCls: '',
  }))
}

const VariantContextKey: InjectionKey<Ref<Variant | undefined>> = Symbol('VariantContextKey')
export function useVariantContextProvider(variant: Ref<Variant | undefined>) {
  provide(VariantContextKey, variant)
}

export function useVariantContext() {
  return inject(VariantContextKey, ref(undefined))
}

export interface FormItemStatusContextProps {
  isFormItemInput?: boolean
  status?: ValidateStatus
  errors?: any[]
  warnings?: any[]
  hasFeedback?: boolean
  feedbackIcon?: any
  name?: NamePath
}

const FormItemInputContextKey: InjectionKey<Ref<FormItemStatusContextProps>> = Symbol('FormItemInputContextKey')

export function useFormItemInputContextProvider(value: Ref<FormItemStatusContextProps>) {
  provide(FormItemInputContextKey, value)
}
export function useFormItemInputContext() {
  return inject(FormItemInputContextKey, ref({} as FormItemStatusContextProps))
}

/** `noStyle` Form Item Context. Used for error collection */
export type ReportMetaChange = (meta: Meta, uniqueKeys: Key[]) => void
const NoStyleItemContextKey: InjectionKey<ReportMetaChange | null> = Symbol('NoStyleItemContextKey')

export function useNoStyleItemContextProvider(value: ReportMetaChange) {
  provide(NoStyleItemContextKey, value)
}

export function useNoStyleItemContext() {
  return inject(NoStyleItemContextKey, null)
}

export const NoFormStyle = defineComponent<{
  override?: boolean
  status?: boolean
}>(
  (props, { slots }) => {
    const formItemInputContext = useFormItemInputContext()
    const newFormItemInputContext = computed(() => {
      const { override, status } = props
      const newContext = { ...formItemInputContext.value }
      if (override) {
        delete newContext.isFormItemInput
      }
      if (status) {
        delete newContext.status
        delete newContext.hasFeedback
        delete newContext.feedbackIcon
      }
      return newContext
    })
    useFormItemInputContextProvider(newFormItemInputContext)
    return () => {
      return slots?.default?.()
    }
  },
)
