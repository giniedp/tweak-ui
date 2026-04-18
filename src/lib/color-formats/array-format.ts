import { ColorCodec, RGBA } from './types'

export class ArrayColorCodec implements ColorCodec<number[]> {
  constructor(
    private components: string[],
    private normalized: boolean,
  ) {}
  public toControl(v: number[]) {
    v = v || []
    const result: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    this.components.forEach((key, i) => {
      result[key] = (v[i] || 0) / (this.normalized ? 1 : 255)
    })
    return result
  }

  public fromControl(rgba: RGBA) {
    return this.components.map(
      (key) => (this.normalized ? rgba[key] : Math.round(rgba[key] * 255)) || 0,
    )
  }
}
