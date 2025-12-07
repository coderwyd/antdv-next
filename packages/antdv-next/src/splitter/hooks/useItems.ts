import type { Slots } from 'vue'
import type { PanelProps } from '../interface'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, isVNode } from 'vue'

export type ItemType = Omit<PanelProps, 'collapsible'> & {
  collapsible: {
    start?: boolean
    end?: boolean
    showCollapsibleIcon: 'auto' | boolean
  }
  _$slots?: Record<string, any>
}

function getCollapsible(collapsible?: PanelProps['collapsible']): ItemType['collapsible'] {
  if (collapsible && typeof collapsible === 'object') {
    return {
      ...collapsible,
      showCollapsibleIcon: collapsible.showCollapsibleIcon === undefined ? 'auto' : collapsible.showCollapsibleIcon,
    }
  }

  const mergedCollapsible = !!collapsible
  return {
    start: mergedCollapsible,
    end: mergedCollapsible,
    showCollapsibleIcon: 'auto',
  }
}

/**
 * Convert `children` into `items`.
 */
function useItems(slots: Slots) {
  return computed(() => {
    const children = filterEmpty(slots?.default?.() ?? [])
    return children.filter(item => isVNode(item)).map((node) => {
      const { props, children } = node
      const { collapsible, ...restProps } = (props ?? {}) as PanelProps
      return {
        ...restProps,
        collapsible: getCollapsible(collapsible),
        _$slots: children,
      } as ItemType
    })
  })
}

export default useItems
