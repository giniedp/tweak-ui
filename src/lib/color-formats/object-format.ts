import { ColorCodec, RGBA } from './types'

const components = ['r', 'g', 'b', 'a']
export class ObjectColorCodec implements ColorCodec<{ [key: string]: number }> {
  constructor(
    private components: string[],
    private normalized: boolean,
  ) {
    //
  }
  public toControl(v: { [key: string]: number }) {
    v = v || {}
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    this.components.forEach((key, i) => {
      result[components[i]] = (v[key] || 0) / (this.normalized ? 1 : 255)
    })
    return result
  }

  public fromControl(rgba: RGBA) {
    const result: { [key: string]: number } = {}
    this.components.forEach((key, i) => {
      result[key] = (this.normalized ? rgba[components[i]] : Math.round(rgba[key] * 255)) || 0
    })
    return result
  }
}
