import m from 'mithril'

import { getColorFormatter } from './color-formats'
import { ColorPickerModel } from './color-picker'
import {
  getModelValue,
  registerComponent,
  setModelValue,
  renderModel,
} from './core'
import {
  call,
  isArray,
  isNumber,
  isObject,
  isString,
  padLeft,
  use,
  twuiClass,
  cssClass,
  viewFn,
} from './utils'
import { ComponentModel, ValueSource, ComponentAttrs } from './types'

/**
 * Color component attributes
 * @public
 */
export type ColorAttrs = ComponentAttrs<ColorModel>

/**
 * Color component model
 * @public
 */
export interface ColorModel<T = any, V = number | string | number[]>
  extends ComponentModel,
    ValueSource<T, V> {
  /**
   * The type name of the control
   */
  type: 'color'
  /**
   * The color value as a string.
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
   * This must be a combination of the letters r, g, b and a
   * and it must match the input value.
   */
  format?: string
  /**
   * Whether each component is normalized to range [0:1]
   */
  normalized?: boolean
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: ColorModel<T, V>, value: V) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: ColorModel<T, V>, value: V) => void
}

registerComponent<ColorAttrs>('color', (node) => {
  let data: ColorModel
  let opened = false
  let value: number | string | number[]
  let rgba: string

  const rgbaFromatter = getColorFormatter('rgba()')
  function updateState() {
    data = node.attrs.data
    value = getModelValue(data)
    rgba = rgbaFromatter.format(getColorFormatter(data.format).parse(value))
  }

  function toggle() {
    opened = !opened
  }
  function onPickerInput(p: ColorPickerModel, v: any) {
    setModelValue(data, v)
    call(data.onInput, data, v)
  }

  function onPickerChange(p: ColorPickerModel, v: any) {
    setModelValue(data, v)
    call(data.onChange, data, v)
  }

  function getText() {
    if (isString(value)) {
      return value
    }
    if (isNumber(value)) {
      return '0x' + padLeft(value.toString(16), 8, '0')
    }
    if (isArray(value)) {
      return value
        .map((it: number) => (it < 1 && it > 0 ? it.toFixed(2) : it))
        .join(' , ')
    }
    if (isObject(value)) {
      return Object.keys(value)
        .map((k) => {
          const it = (value as any)[k]
          return `${k}: ${it < 1 && it > 0 ? it.toFixed(2) : it}`
        })
        .join(' ')
    }
    if (value == null) {
      return 'null'
    }
    return '?'
  }

  return {
    view: viewFn(() => {
      updateState()
      return m(
        'div',
        {
          class: cssClass({
            [twuiClass(data.type)]: true,
            [twuiClass(data.type + '-open')]: opened,
          }),
        },
        m(
          "button[type='button']",
          {
            style: { 'background-color': rgba },
            onclick: toggle,
          },
          getText() || '?',
        ),
        renderModel<ColorPickerModel>({
          type: 'color-picker',
          value: value,
          format: data.format,
          onInput: onPickerInput,
          onChange: onPickerChange,
          hidden: !opened,
        }),
      )
    }),
  }
})
