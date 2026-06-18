import { ArrayColorAdapter } from './array-format'
import { CssColorAdapter } from './css-string-format'
import { HexColorAdapter } from './hex-string-format'
import { NumberColorAdapter } from './number-format'
import { ObjectColorCodec } from './object-format'
import { ColorAdapter } from './types'

const codecs: { [key: string]: ColorAdapter<any> } = {}

/**
 * Gets a formatter implementation for the given format
 *
 * @public
 * @param format - The format code
 */
export function getColorAdapter(format: string = 'rgb()'): ColorAdapter<any> {
  if (format in codecs) {
    return codecs[format]
  }

  {
    // array format
    // - prefix: [] or [n]
    // - optional trailing layout of components (e.g. [n]bgra)
    const match = format.match(/^\[(n?)\]([rgba]+)?$/i)
    if (match) {
      const isNormalized = !!match[1]
      const components = (match[2] || 'rgba').toLowerCase().split('')
      codecs[format] = new ArrayColorAdapter(components, isNormalized)
      return codecs[format]
    }
  }

  {
    // object format
    // - prefix: {} or {n} for normalized values
    // - optional trailing mapping of (e.g. {n}xyzw, to map rgba to xyzw)
    const match = format.match(/^\{(n?)\}([rgbaxyzw]+)?$/i)
    if (match) {
      const isNormalized = !!match[1]
      const components = (match[2] || 'rgba').split('')
      codecs[format] = new ObjectColorCodec(components, isNormalized)
      return codecs[format]
    }
  }

  {
    // number format
    // - prefix: 0x
    // - optional trailing mapping of (e.g. 0xRGBA)
    const match = format.match(/^0x([rgba]+)?$/i)
    if (match) {
      const components = (match[1] || 'rgba').toLowerCase().split('')
      codecs[format] = new NumberColorAdapter(components)
      return codecs[format]
    }
  }

  {
    // hex format
    // - prefix: #
    // - optional trailing mapping of (e.g. #RGBA)
    const match = format.match(/^#([rgba]+)?$/)
    if (match) {
      const components = (match[1] || 'rgba').toLowerCase().split('')
      codecs[format] = new HexColorAdapter(components, '#')
      return codecs[format]
    }
  }

  {
    // css format
    // - suffix: ()
    // - leading mapping (e.g. rgb() or rgba())
    const match = format.match(/^(rgb|rgba)\(\)$/)
    if (match) {
      const components = (match[2] || 'rgba').toLowerCase().split('')
      codecs[format] = new CssColorAdapter(components)
      return codecs[format]
    }
  }
  {
    // hex format without # prefix
    // - trailing mapping of (e.g. RGBA)
    const match = format.match(/^[rgba]+$/)
    if (match) {
      const components = format.split('')
      codecs[format] = new HexColorAdapter(components, '')
      return codecs[format]
    }
  }
  return codecs[format]
}
