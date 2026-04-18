import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { ControlValue, getControlValue, setControlValue } from '../../core'
import { call, twuiClass } from '../../core/utils'
import { ControlAttrs, ControlComponent } from './control'
import { uiNumber } from './number'

/**
 * @public
 */
export type VectorValue = number[] | { [key: string]: number } | { [key: number]: number }

/**
 * Vector component model
 * @public
 */
export interface VectorAttrs<T = unknown> extends ControlValue<T, VectorValue>, ControlAttrs {
  /**
   * The vector object field names. Defaults to `['x', 'y', 'z']`
   */
  keys?: string[]
  /**
   * The min value
   */
  min?: number
  /**
   * The max value
   */
  max?: number
  /**
   * The step value
   */
  step?: number
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: T, value: unknown, key?: string | number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: T, value: unknown, key?: string | number) => void
  /**
   * Disables the control input
   */
  disabled?: boolean
}

export function uiVector<T>(attrs: VectorAttrs<T>, children?: Children): Vnode<VectorAttrs<T>> {
  return m(VectorComponent as any, attrs as any, children)
}

const defaultKeys = ['x', 'y', 'z']
export const VectorKey = 'vector'
export const VectorComponent: FactoryComponent<VectorAttrs> = () => {
  let attrs: VectorAttrs

  function onChange(type: 'input' | 'change', field: string, v: number) {
    const value: any = getControlValue(attrs) || {}
    value[field] = isNaN(v) ? null : v
    setControlValue(attrs, value)
    call(type === 'input' ? attrs.onInput : attrs.onChange, attrs.value, value, field)
  }

  return {
    view: (node) => {
      attrs = node.attrs
      const keys = attrs.keys || defaultKeys
      const value = getControlValue(attrs) as any
      return m(
        ControlComponent,
        {
          label: attrs.label,
          description: attrs.description,
          class: twuiClass(VectorKey),
        },
        keys.map((field) => {
          return uiNumber({
            min: attrs.min,
            max: attrs.max,
            step: attrs.step,
            value: value?.[field],
            disabled: attrs.disabled,
            onInput: (_, v) => onChange('input', field, v as number),
            onChange: (_, v) => onChange('change', field, v as number),
            placeholder: field,
          })
        }),
      )
    },
  }
}
