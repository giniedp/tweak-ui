import { ColorAdapter, RGBA } from './types'

export class CssColorAdapter implements ColorAdapter<string> {
  private components: string[] = ['r', 'g', 'b', 'a']

  public constructor(components: string[]) {
    this.components = components
  }

  public toControl(value: string) {
    value = value || 'rgba(0, 0, 0)'
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    const values = value
      .replace(/[rgba\(\)]/gi, '')
      .split(/,\s*?/gi)
      .map(Number)
    this.components.forEach((key, i) => {
      result[key] = (values[i] || 0) / (key === 'a' ? 1 : 255)
    })
    return result
  }

  public fromControl(rgba: RGBA) {
    return (
      this.components.join('') +
      '(' +
      this.components
        .map((key) => {
          return key === 'a' ? rgba[key] : Math.round(rgba[key] * 255)
        })
        .join(', ') +
      ')'
    )
  }
}
