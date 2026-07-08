import m, { Children, Vnode } from 'mithril'
import { getColorAdapter } from '../../color'
import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { isArray, isNumber, isObject, isString, padLeft } from '../../core/utils'
import { CommonWidgetAttrs, uiWidget } from '../elements'
import { uiColorPicker } from './color-picker'

export type ColorWidgetAttrs<T = unknown> = CommonWidgetAttrs & ColorAttrs<T>

/**
 * Color component model
 * @public
 */
export type ColorAttrs<T = unknown> = TweakableAttrs<T, any> & {
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
  oninput?: (model: T, value: any) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: T, value: any) => void
}

export function uiColorWidget<T>(
  attrs: ColorWidgetAttrs<T>,
  children?: Children,
): Vnode<ColorWidgetAttrs<T>> {
  return m(ColorWidgetComponent<T>, attrs, children)
}

export function uiColor<T>(attrs: ColorAttrs<T>, children?: Children): Vnode<ColorAttrs<T>> {
  return m(ColorComponent<T>, attrs, children)
}

export const ColorWidgetComponent = <T>(): m.Component<ColorWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || ''}.twk-color-widget`,
          label: label ?? (rest.field as any),
          class: className,
        },
        [m(ColorComponent<T>, rest)],
      )
    },
  }
}

export const ColorComponent = <T>(): m.Component<ColorAttrs<T>> => {
  let attrs: ColorAttrs<T>
  let opened = false
  let rgba: string
  let value: any
  const codec = getColorAdapter('rgba()')

  function updateState(node: Vnode<ColorAttrs<T>>) {
    attrs = node.attrs
    value = getControlValue(attrs)
    rgba = codec.fromControl(getColorAdapter(attrs.format).toControl(value))
  }

  function toggle() {
    opened = !opened
  }

  function onPickerInput(p: T, v: any) {
    setControlValue(attrs, v)
    attrs.oninput?.(attrs.value, v)
  }

  function onPickerChange(p: T, v: any) {
    setControlValue(attrs, v)
    attrs.onchange?.(attrs.value, v)
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
    onbeforeupdate: updateState,
    view: ({ attrs: { value, field, binding, format } }) => {
      return [
        m(
          'div.twk-color-input',
          {
            style: { '--twk-color-value': rgba },
          },
          m(
            "button.twk-btn[type='button']",
            {
              onclick: toggle,
            },
            getText() || '?',
          ),
          opened
            ? m.fragment({}, [
                uiColorPicker({
                  binding: binding as never,
                  value: value as any,
                  field: field,
                  format: format,
                  oninput: onPickerInput,
                  onchange: onPickerChange,
                }),
              ])
            : null,
        ),
      ]
    },
  }
}
