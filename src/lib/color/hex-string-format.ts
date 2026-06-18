import { padLeft } from '../core/utils'
import { ColorAdapter, RGBA } from './types'

export class HexColorAdapter implements ColorAdapter<string> {
  constructor(
    private components: string[],
    private prefix = '#',
  ) {}
  public toControl(value?: string) {
    value = value || '#000'
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    let v = value.match(/[0-9a-f]+/i)?.[0]
    if (v == null) {
      return result
    }
    if (v.length === this.components.length) {
      v = v
        .split('')
        .map((it) => `${it}${it}`)
        .join('')
    }
    this.components.forEach((key, i) => {
      result[key] = parseInt(v.substr(i * 2, 2), 16) / 255
    })
    return result
  }

  public fromControl(rgba: RGBA) {
    return (
      this.prefix +
      this.components
        .map((key) => padLeft(Math.round(rgba[key] * 255).toString(16), 2, '0'))
        .join('')
    )
  }
}
