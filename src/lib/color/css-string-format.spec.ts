import { describe, expect, it } from 'vitest'
import { CssColorAdapter } from './css-string-format'

describe('CssStringFormat', () => {
  describe('decode', () => {
    it('rgb', () => {
      expect(new CssColorAdapter(['r', 'g', 'b']).toControl('rgb(10, 20, 30)')).toEqual({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 1,
      })
    })

    it('rgba', () => {
      expect(new CssColorAdapter(['r', 'g', 'b', 'a']).toControl('rgba(10, 20, 30, 0.5)')).toEqual({
        r: 10 / 255,
        g: 20 / 255,
        b: 30 / 255,
        a: 0.5,
      })
    })
  })

  describe('encode', () => {
    it('rgb', () => {
      expect(
        new CssColorAdapter(['r', 'g', 'b']).fromControl({
          r: 10 / 255,
          g: 20 / 255,
          b: 30 / 255,
          a: 0.5,
        }),
      ).toEqual('rgb(10, 20, 30)')
    })

    it('rgba', () => {
      expect(
        new CssColorAdapter(['r', 'g', 'b', 'a']).fromControl({
          r: 10 / 255,
          g: 20 / 255,
          b: 30 / 255,
          a: 0.5,
        }),
      ).toEqual('rgba(10, 20, 30, 0.5)')
    })
  })
})
