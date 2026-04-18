import { NumberColorCodec } from './number-format'
import { describe, expect, it } from 'vitest'

describe('NumberColorFormat', () => {
  describe('decode', () => {
    it('rgb', () => {
      expect(new NumberColorCodec(['r', 'g', 'b']).toControl(0x00102030)).toEqual({
        r: 0x30 / 255,
        g: 0x20 / 255,
        b: 0x10 / 255,
        a: 1,
      })
    })

    it('rgba', () => {
      expect(new NumberColorCodec(['r', 'g', 'b', 'a']).toControl(0x40102030)).toEqual({
        r: 0x30 / 255,
        g: 0x20 / 255,
        b: 0x10 / 255,
        a: 0x40 / 255,
      })
    })
  })

  describe('encode', () => {
    it('rgb', () => {
      expect(
        new NumberColorCodec(['r', 'g', 'b']).fromControl({
          r: 0x10 / 255,
          g: 0x20 / 255,
          b: 0x30 / 255,
          a: 1,
        }),
      ).toEqual(0x00302010)
    })

    it('rgba', () => {
      expect(
        new NumberColorCodec(['r', 'g', 'b', 'a']).fromControl({
          r: 0x10 / 255,
          g: 0x20 / 255,
          b: 0x30 / 255,
          a: 1,
        }),
      ).toEqual(0xff302010)
    })
  })
})
