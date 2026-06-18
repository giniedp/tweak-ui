import { describe, expect, it } from 'vitest'
import { getColorAdapter } from './'
import { ArrayColorAdapter } from './array-format'
import { CssColorAdapter } from './css-string-format'
import { HexColorAdapter } from './hex-string-format'
import { NumberColorAdapter } from './number-format'
import { ObjectColorCodec } from './object-format'

describe('getColorFormatter', () => {
  it('#rgb', () => {
    const a = getColorAdapter('#rgb')
    const b = getColorAdapter('#rgb')
    expect(a instanceof HexColorAdapter).toBe(true)
    expect(a).toBe(b)
  })

  it('rgb', () => {
    const a = getColorAdapter('rgb')
    const b = getColorAdapter('rgb')
    expect(a instanceof HexColorAdapter).toBe(true)
    expect(a).toBe(b)
  })

  it('rgb()', () => {
    expect(getColorAdapter('rgb()') instanceof CssColorAdapter).toBe(true)
  })

  it('0xrgb', () => {
    expect(getColorAdapter('0xrgb') instanceof NumberColorAdapter).toBe(true)
  })

  it('{}rgb', () => {
    expect(getColorAdapter('{}rgb') instanceof ObjectColorCodec).toBe(true)
  })

  it('{n}rgb', () => {
    expect(getColorAdapter('{n}rgb') instanceof ObjectColorCodec).toBe(true)
  })

  it('[]rgb', () => {
    expect(getColorAdapter('[]rgb') instanceof ArrayColorAdapter).toBe(true)
  })

  it('[n]rgb', () => {
    expect(getColorAdapter('[n]rgb') instanceof ArrayColorAdapter).toBe(true)
  })
})
