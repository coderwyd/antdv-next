export function isValidWaveColor(color: string) {
  return (
    !!color
    && color !== '#fff'
    && color !== '#ffffff'
    && color !== 'rgb(255, 255, 255)'
    && color !== 'rgba(255, 255, 255, 1)'
    && !/rgba\((?:\d*, ){3}0\)/.test(color)
    && color !== 'transparent'
    && color !== 'canvastext'
  )
}

export function getTargetWaveColor(
  node: HTMLElement,
  colorSource: keyof CSSStyleDeclaration | null = null,
) {
  const style = getComputedStyle(node)
  const { borderTopColor, borderColor, backgroundColor } = style
  if (colorSource && isValidWaveColor((style as any)[colorSource])) {
    return style[colorSource] as any
  }
  return [borderTopColor, borderColor, backgroundColor].find(isValidWaveColor) ?? null
}
