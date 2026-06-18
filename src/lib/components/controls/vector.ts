import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue } from '../../core'
import { uiClass } from '../../core/utils'
import { uiControl, ValueControlAttrs } from '../elements'
import { uiNumber } from './number'

/**
 * @public
 */
export type VectorValue = number[] | { [key: string]: number } | { [key: number]: number }

/**
 * Vector component model
 * @public
 */
export interface VectorAttrs<T = unknown> extends ValueControlAttrs<T, VectorValue> {
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
   * Number of columns to display. By default, this is determined by the number of keys.
   */
  cols?: number
  /**
   * Whether to hide the field labels and just show the input controls. Default is false.
   */
  unlabeled?: boolean
  /**
   * This is called when the control value has been changed.
   */
  oninput?: (model: T, value: unknown, key?: string | number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: T, value: unknown, key?: string | number) => void
  /**
   * Disables the control input
   */
  disabled?: boolean
}

export function uiVector<T>(attrs: VectorAttrs<T>, children?: Children): Vnode<VectorAttrs<T>> {
  return m(VectorComponent as any, attrs as any, children)
}

const defaultKeys = ['x', 'y', 'z']
export const VectorComponent: FactoryComponent<VectorAttrs> = () => {
  function onchange(type: 'input' | 'change', field: string, v: number, attrs: VectorAttrs) {
    const value: any = getControlValue(attrs) || {}
    value[field] = isNaN(v) ? null : v
    setControlValue(attrs, value)
    const cb = type === 'input' ? attrs.oninput : attrs.onchange
    cb?.(attrs.value, value, field)
  }

  return {
    view: ({ attrs }) => {
      const keys = attrs.keys || defaultKeys
      const cols = attrs.cols || keys.length
      const value = getControlValue(attrs) as any
      return uiControl(
        {
          label: attrs.label,
          description: attrs.description,
          class: uiClass('twui-vector', attrs.class),
          contentStyle: {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          },
        },
        keys.map((field) => {
          return m('span', { class: 'twui-vector-field' }, [
            attrs.unlabeled ? null : m('span', field),
            uiNumber({
              min: attrs.min,
              max: attrs.max,
              step: attrs.step,
              value: value?.[field],
              disabled: attrs.disabled,
              oninput: (_, v) => onchange('input', field, v as number, attrs),
              onchange: (_, v) => onchange('change', field, v as number, attrs),
              placeholder: field,
            }),
          ])
        }),
      )
    },
  }
}
