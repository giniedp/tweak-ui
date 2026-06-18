import { ColorAdapter } from './types'

export const ColorVec3Adapter: ColorAdapter<{ x: number; y: number; z: number }> = {
  toControl(v) {
    v = v || { x: 0, y: 0, z: 0 }
    return {
      r: v.x / 255,
      g: v.y / 255,
      b: v.z / 255,
      a: 1,
    }
  },
  fromControl(v) {
    return {
      x: Math.round(v.r * 255),
      y: Math.round(v.g * 255),
      z: Math.round(v.b * 255),
    }
  },
}
