import { HexColorAdapter } from './hex-string-format'
import { describe, expect, it } from 'vitest'

describe('HexStringFormat', () => {
  describe('decode', () => {
    it('rgb #102030', () => {
      expect(new HexColorAdapter(['r', 'g', 'b']).toControl('#102030')).toEqual({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 1,
      })
    })

    it('rgb #123', () => {
      expect(new HexColorAdapter(['r', 'g', 'b']).toControl('#123')).toEqual({
        r: 0x11 / 255,
        g: 0x22 / 255,
        b: 0x33 / 255,
        a: 1,
      })
    })

    it('rgba #10203040', () => {
      expect(new HexColorAdapter(['r', 'g', 'b', 'a']).toControl('#10203040')).toEqual({
        r: 0x10 / 255,
        g: 0x20 / 255,
        b: 0x30 / 255,
        a: 0x40 / 255,
      })
    })
  })

  describe('encode', () => {
    it('rgb', () => {
      expect(
        new HexColorAdapter(['r', 'g', 'b']).fromControl({
          r: 0x10 / 255,
          g: 0x20 / 255,
          b: 0x30 / 255,
          a: 1,
        }),
      ).toEqual('#102030')
    })

    it('rgba', () => {
      expect(
        new HexColorAdapter(['r', 'g', 'b', 'a']).fromControl({
          r: 0x10 / 255,
          g: 0x20 / 255,
          b: 0x30 / 255,
          a: 0x40 / 255,
        }),
      ).toEqual('#10203040')
    })
  })
})
