import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

export interface FormProviderProps {

}

const FormProviderKey: InjectionKey<FormProviderProps> = Symbol('FormProviderKey')

export function useFormProvider(value: FormProviderProps) {
  provide(FormProviderKey, value)
}

export function useFormProviderContext() {
  return inject(FormProviderKey, {} as FormProviderProps)
}
