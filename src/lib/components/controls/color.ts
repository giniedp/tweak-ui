import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getColorCodec } from '../../color-formats'
import { ControlValue, getControlValue, getRawValue, setControlValue } from '../../core'
import {
  call,
  cssClass,
  isArray,
  isNumber,
  isObject,
  isString,
  padLeft,
  twuiClass,
} from '../../core/utils'
import { ControlAttrs, ControlComponent } from './control'
import { ColorPickerAttrs, uiColorPicker } from './color-picker'

/**
 * Color component model
 * @public
 */
export interface ColorAttrs<T = unknown> extends ControlValue<T, any>, ControlAttrs {
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
  onInput?: (model: T, value: any) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: T, value: any) => void
}

export function uiColor<T>(attrs: ColorAttrs<T>, children?: Children): Vnode<ColorAttrs<T>> {
  return m(ColorControl as any, attrs as any, children)
}

export const ColorControl: FactoryComponent<ColorAttrs> = () => {
  let attrs: ColorAttrs<any>
  let opened = false
  let rgba: string
  let value: any
  const codec = getColorCodec('rgba()')

  function updateState(node: Vnode<ColorAttrs>) {
    attrs = node.attrs
    value = getControlValue(attrs)
    rgba = codec.fromControl(getColorCodec(attrs.format).toControl(value))
  }

  function toggle() {
    opened = !opened
  }

  function onPickerInput(p: ColorPickerAttrs, v: any) {
    setControlValue(attrs, v)
    call(attrs.onInput, attrs.value, v)
  }

  function onPickerChange(p: ColorPickerAttrs, v: any) {
    setControlValue(attrs, v)
    call(attrs.onChange, attrs.value, v)
  }

  function getText() {
    if (isString(value)) {
      return value
    }
    if (isNumber(value)) {
      return '0x' + padLeft(value.toString(16), 8, '0')
    }
    if (isArray(value)) {
      return value.map((it: number) => (it < 1 && it > 0 ? it.toFixed(2) : it)).join(' , ')
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
    oninit: updateState,
    onupdate: updateState,
    view: (node) => {
      updateState(node)
      return m.fragment({}, [
        m(
          ControlComponent,
          {
            label: attrs.label,
            description: attrs.description,
            class: {
              [twuiClass('color')]: true,
              [twuiClass('color-open')]: opened,
            },
          },
          m(
            "button[type='button']",
            {
              style: { 'background-color': rgba },
              onclick: toggle,
            },
            getText() || '?',
          ),
        ),
        opened
          ? m.fragment({}, [
              uiColorPicker({
                value: getRawValue(attrs),
                format: attrs.format,
                onInput: onPickerInput,
                onChange: onPickerChange,
              }),
            ])
          : null,
      ])
    },
  }
}
