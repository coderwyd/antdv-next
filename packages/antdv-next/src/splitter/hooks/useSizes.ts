import type { Ref } from 'vue'
import type { PanelProps } from '../interface.ts'
import { computed, shallowRef, unref } from 'vue'
import { autoPtgSizes } from './sizeUtil.ts'

export function getPtg(str: string) {
  return Number(str.slice(0, -1)) / 100
}

function isPtg(itemSize: string | number | undefined): itemSize is string {
  return typeof itemSize === 'string' && itemSize.endsWith('%')
}

/**
 * Save the size state.
 * Align the size into flex percentage base.
 */

export default function useSizes(items: Ref<PanelProps[]>, containerSize?: Ref<number>) {
  const propSizes = computed(() => items.value.map(item => item.size))
  const itemsCount = computed(() => items.value.length)

  const mergedContainerSize = computed(() => unref(containerSize) || 0)
  const ptg2px = (ptg: number) => ptg * mergedContainerSize.value

  // We do not need care the size state match the `items` length in `useState`.
  // It will calculate later.
  const innerSizes = shallowRef<(string | number | undefined)[]>([])

  // Track the last known items count to detect panel add/remove
  let lastItemsCount = 0

  const sizes = computed(() => {
    const currentCount = itemsCount.value
    const mergedSizes: PanelProps['size'][] = []

    // Initialize or re-initialize innerSizes when items count changes
    // This happens on first render or when panels are added/removed
    if (currentCount !== lastItemsCount) {
      lastItemsCount = currentCount
      innerSizes.value = items.value?.map(item => item.defaultSize)
    }

    for (let i = 0; i < currentCount; i += 1) {
      mergedSizes[i] = propSizes.value?.[i] ?? innerSizes.value?.[i]
    }

    return mergedSizes
  })

  const postPercentMinSizes = computed(() => {
    return items.value.map((item) => {
      if (isPtg(item.min)) {
        return getPtg(item.min)
      }
      return (item.min || 0) / mergedContainerSize.value
    })
  })

  const postPercentMaxSizes = computed(() => {
    return items.value.map((item) => {
      if (isPtg(item.max)) {
        return getPtg(item.max)
      }
      return (item.max || mergedContainerSize.value) / mergedContainerSize.value
    })
  })

  // Post handle the size. Will do:
  // 1. Convert all the px into percentage if not empty.
  // 2. Get rest percentage for exist percentage.
  // 3. Fill the rest percentage into empty item.
  const postPercentSizes = computed(() => {
    const ptgList: (number | undefined)[] = []

    // Fill default percentage
    for (let i = 0; i < itemsCount.value; i += 1) {
      const itemSize = sizes.value[i]

      if (isPtg(itemSize)) {
        ptgList[i] = getPtg(itemSize)
      }
      else if (itemSize || itemSize === 0) {
        const num = Number(itemSize)
        if (!Number.isNaN(num)) {
          ptgList[i] = num / mergedContainerSize.value
        }
      }
      else {
        ptgList[i] = undefined
      }
    }

    // Use autoPtgSizes to handle the undefined sizes
    return autoPtgSizes(ptgList, postPercentMinSizes.value, postPercentMaxSizes.value)
  })

  const postPxSizes = computed(() => postPercentSizes.value.map(ptg2px))

  // If ssr, we will use the size from developer config first.
  const panelSizes = computed(() => containerSize?.value ? postPxSizes.value : sizes.value)

  const setInnerSizes = (newSizes: number[]) => {
    innerSizes.value = newSizes
  }

  return [
    panelSizes,
    postPxSizes,
    postPercentSizes,
    postPercentMinSizes,
    postPercentMaxSizes,
    setInnerSizes,
  ] as const
}
