import type { InjectionKey, Ref } from 'vue'
import { inject, ref } from 'vue'

export interface InternalContextProps {
  rootComponent: string
  itemComponent: string
}

const InternalContext: InjectionKey<Ref<InternalContextProps>> = Symbol('InternalContext')
/**
 * When use this context. Will trade as sub component instead of root Steps component.
 */
export function useInternalContext() {
  return inject(InternalContext, ref(null) as any) as Ref<InternalContextProps | null>
}
