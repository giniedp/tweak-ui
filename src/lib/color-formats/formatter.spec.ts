import { describe, expect, it } from 'vitest'
import { getColorCodec } from './'
import { ArrayColorCodec } from './array-format'
import { CssColorCodec } from './css-string-format'
import { HexColorCodec } from './hex-string-format'
import { NumberColorCodec } from './number-format'
import { ObjectColorCodec } from './object-format'

describe('getColorFormatter', () => {
  it('#rgb', () => {
    const a = getColorCodec('#rgb')
    const b = getColorCodec('#rgb')
    expect(a instanceof HexColorCodec).toBe(true)
    expect(a).toBe(b)
  })

  it('rgb', () => {
    const a = getColorCodec('rgb')
    const b = getColorCodec('rgb')
    expect(a instanceof HexColorCodec).toBe(true)
    expect(a).toBe(b)
  })

  it('rgb()', () => {
    expect(getColorCodec('rgb()') instanceof CssColorCodec).toBe(true)
  })

  it('0xrgb', () => {
    expect(getColorCodec('0xrgb') instanceof NumberColorCodec).toBe(true)
  })

  it('{}rgb', () => {
    expect(getColorCodec('{}rgb') instanceof ObjectColorCodec).toBe(true)
  })

  it('{n}rgb', () => {
    expect(getColorCodec('{n}rgb') instanceof ObjectColorCodec).toBe(true)
  })

  it('[]rgb', () => {
    expect(getColorCodec('[]rgb') instanceof ArrayColorCodec).toBe(true)
  })

  it('[n]rgb', () => {
    expect(getColorCodec('[n]rgb') instanceof ArrayColorCodec).toBe(true)
  })
})
