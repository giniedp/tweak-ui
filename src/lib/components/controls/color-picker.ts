// tslint:disable:no-bitwise
import m from 'mithril'

import {
  getColorFormatter,
  HSV,
  hsv2rgb,
  HSVA,
  rgb2hsv,
  RGBA,
} from '../../color-formats'
import {
  getValue,
  component,
  setValue,
  ComponentModel,
  ValueSource,
  ComponentAttrs,
} from '../../core'
import {
  call,
  clamp,
  use,
  twuiClass,
  getTouchPoint,
} from '../../core/utils'

/**
 * Color picker component attributes
 *
 * @public
 */
export type ColorPickerAttrs = ComponentAttrs<ColorPickerModel>

/**
 * Color picker component model
 *
 * @public
 */
export interface ColorPickerModel<T = unknown, V = number | string | number[]>
  extends ComponentModel,
    ValueSource<T, V> {
  /**
   * The type name of the control
   */
  type: 'color-picker'
  /**
   * If `target` and `property` are not set, then this is used as the control value
   *
   * @remarks
   * The format is determined by the `format` property.
   *
   * It is allowed to omit the '#' character but the '#' will be added on change
   *
   * It is allowed to use single character form per component (#f00 instead of #ff0000)
   * but it will always be written back as #ff0000 on change
   */
  value?: V
  /**
   * The format of the string value. Defaults to 'rgb'
   *
   * @remarks
   * This must be a combination of the letters `r`, `g`, `b` and `a`.
   *
   * A prefix of `#` indicates the input/output is a hex string. e.g. #rgba
   *
   * A prefix of `0x` indicates the input is a number. e.g. 0xrgba
   *
   * A prefix of `[]` indicates the input is an array of numbers. e.g. `[]rgba`
   *
   * If a prefix is missing `#` is assumed
   */
  format?: string
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: ColorPickerModel<T, V>, value: unknown) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: ColorPickerModel<T, V>, value: unknown) => void
}

component<ColorPickerAttrs>('color-picker', (node) => {
  let hue = 0 // range [0,1]
  let sat = 0 // range [0,1]
  let val = 0 // range [0,1]
  let a = 0 // range [0,1]

  function getHSVA(s = sat, v = val): HSVA {
    return {
      h: hue * 360,
      s: s,
      v: v,
      a: a,
    }
  }

  function getRGB(s = sat, v = val) {
    return hsv2rgb(getHSVA(s, v))
  }

  function getRGBA(s = sat, v = val, alpha = a): RGBA {
    return { ...getRGB(s, v), a: alpha }
  }

  function setHSV(hsv: HSV) {
    hue = hsv.h / 360
    sat = hsv.s
    val = hsv.v
  }

  function setHSVA(hsv: HSVA) {
    setHSV(hsv)
    a = hsv.a
  }

  function getHexRGB(s?: number, v?: number) {
    return getColorFormatter('#rgb').format(getRGBA(s, v))
  }

  function getHexRGBA(s?: number, v?: number) {
    return getColorFormatter('#rgba').format(getRGBA(s, v))
  }

  function getCssRGBA(s = sat, v = val, alpha: number = a) {
    return getColorFormatter('rgba()').format(getRGBA(s, v, alpha))
  }

  function parseInput(value: string | number | number[], format: string) {
    const rgba = getColorFormatter(format || 'rgb').parse(value)
    setHSVA({
      ...rgb2hsv(rgba),
      a: rgba.a,
    })
  }

  function formatOutput(format: string) {
    return getColorFormatter(format).format(getRGBA())
  }

  function triggerInput() {
    use(node.attrs.data, (data) => {
      const value = formatOutput(data.format)
      const written = setValue(data, value)
      call(data.onInput, data, written)
    })
  }

  function triggerChange() {
    use(node.attrs.data, (data) => {
      const value = formatOutput(data.format)
      const written = setValue(data, value)
      call(data.onChange, data, written)
    })
  }

  function hasAlpha() {
    return use(node.attrs.data, (data) => {
      return data.format && data.format.match(/a/i)
    })
  }

  //
  // manual input
  //

  function inputR(e: Event) {
    input(e, 'r')
  }

  function inputG(e: Event) {
    input(e, 'g')
  }

  function inputB(e: Event) {
    input(e, 'b')
  }

  function input(e: Event, field: keyof RGBA) {
    const color = getRGBA()
    color[field] = parseInt((e.target as HTMLInputElement).value, 10) / 255
    setHSV(rgb2hsv(color))
    triggerInput()
    triggerChange()
  }

  function inputHex(e: Event) {
    parseInput(
      (e.target as HTMLInputElement).value,
      hasAlpha() ? 'rgba' : 'rgb',
    )
    triggerInput()
    triggerChange()
  }

  //
  // drag input
  //

  let target: HTMLElement
  let kind: 'sv' | 'h' | 'a'
  function beginPickSV(e: MouseEvent) {
    kind = 'sv'
    enableDrag(e.target as HTMLElement)
    onMouseMove(e)
  }

  function beginPickH(e: MouseEvent) {
    kind = 'h'
    enableDrag(e.target as HTMLElement)
    onMouseMove(e)
  }

  function beginPickA(e: MouseEvent) {
    kind = 'a'
    enableDrag(e.target as HTMLElement)
    onMouseMove(e)
  }

  function enableDrag(el: HTMLElement) {
    disableDrag()
    target = el
    const options = { passive: false }
    document.addEventListener('mousemove', onMouseMove, options)
    document.addEventListener('mouseup', onMouseUp, options)
    document.addEventListener('touchmove', onMouseMove, options)
    document.addEventListener('touchend', onMouseUp, options)
    document.addEventListener('touchcancel', onMouseUp, options)
  }

  function disableDrag() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('touchmove', onMouseMove)
    document.removeEventListener('touchend', onMouseUp)
    document.removeEventListener('touchcancel', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    if (!target) {
      return
    }
    e.preventDefault()

    const rect = target.getBoundingClientRect()
    const tx = window.pageXOffset || document.documentElement.scrollLeft
    const ty = window.pageYOffset || document.documentElement.scrollTop
    const cw = target.clientWidth
    const ch = target.clientHeight
    let [cx, cy] = getTouchPoint(e)
    cx = clamp((cx - tx - rect.left) / cw, 0, 1)
    cy = clamp((cy - ty - rect.top) / ch, 0, 1)

    if (kind === 'sv') {
      sat = cx
      val = 1 - cy
    }
    if (kind === 'h') {
      hue = 1 - cx
    }
    if (kind === 'a') {
      a = cx
    }

    triggerInput()
    m.redraw()
  }

  function onMouseUp() {
    if (target != null) {
      target = null
      disableDrag()
      triggerChange()
    }
  }

  return {
    onremove: () => {
      disableDrag()
    },
    oninit: () => {
      use(node.attrs.data, (data) => {
        parseInput(getValue(data), data.format)
      })
    },
    view: () => {
      return use(node.attrs.data, (data) => {
        const rgba = getRGBA()
        return m(
          'div',
          {
            class: twuiClass(data.type),
          },
          m(
            '.color-picker-inputs',
            m("input.input-hex[type='text']", {
              value: hasAlpha() ? getHexRGBA() : getHexRGB(),
              onchange: inputHex,
            }),
            m("input.input-r[type='number']", {
              min: 0,
              max: 255,
              step: 1,
              value: Math.round(rgba.r * 255),
              onchange: inputR,
            }),
            m("input.input-g[type='number']", {
              min: 0,
              max: 255,
              step: 1,
              value: Math.round(rgba.g * 255),
              onchange: inputG,
            }),
            m("input.input-b[type='number']", {
              min: 0,
              max: 255,
              step: 1,
              value: Math.round(rgba.b * 255),
              onchange: inputB,
            }),
          ),
          m(
            '.color-picker-panel',
            m(
              '.color-picker-sv',
              {
                tabindex: 0,
                onmousedown: beginPickSV,
                ontouchstart: beginPickSV,
                style: {
                  'background-color': `${getCssRGBA(1, 1, 1)}`,
                  'user-select': 'none',
                },
              },
              m('.color-picker-sv-bg', {
                style: {
                  background:
                    'linear-gradient(to right,rgba(255,255,255,1),rgba(255,255,255,0))',
                  'user-select': 'none',
                  'pointer-events': 'none',
                },
              }),
              m('.color-picker-sv-bg', {
                style: {
                  background:
                    'linear-gradient(to top,rgba(0,0,0,1),rgba(0,0,0,0))',
                  'user-select': 'none',
                  'pointer-events': 'none',
                },
              }),
              m('.color-picker-sv-cursor', {
                style: {
                  'user-select': 'none',
                  'pointer-events': 'none',
                  'background-color': `${getCssRGBA(hue, sat, 1)}`,
                  left: `${sat * 100}%`,
                  top: `${(1 - val) * 100}%`,
                },
              }),
            ),
            m(
              '.color-picker-h',
              {
                tabindex: 0,
                onmousedown: beginPickH,
                ontouchstart: beginPickH,
                style: {
                  'user-select': 'none',
                  background:
                    'linear-gradient(to right, #f00 0, #f0f 17% , #00f 33% , #0ff 50% , #0f0 67% , #ff0 83% , #f00 100%)',
                },
              },
              m('.color-picker-h-cursor', {
                style: {
                  'user-select': 'none',
                  'pointer-events': 'none',
                  'background-color': `${getCssRGBA(1, 1, 1)}`,
                  position: 'absolute',
                  left: `${(1 - hue) * 100}%`,
                },
              }),
            ),
            !hasAlpha()
              ? null
              : m(
                  '.color-picker-a',
                  {
                    tabindex: 0,
                    onmousedown: beginPickA,
                    ontouchstart: beginPickA,
                    style: {
                      'user-select': 'none',
                    },
                  },
                  m('.color-picker-a-bg', {
                    style: {
                      background: `linear-gradient(to right, ${getCssRGBA(
                        sat,
                        val,
                        0,
                      )}, ${getCssRGBA(sat, val, 1)})`,
                    },
                  }),
                  m('.color-picker-a-cursor', {
                    style: {
                      'user-select': 'none',
                      'pointer-events': 'none',
                      position: 'absolute',
                      left: `${a * 100}%`,
                    },
                  }),
                ),
          ),
        )
      })
    },
  }
})
