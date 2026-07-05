import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { CommonWidgetAttrs, uiWidget } from '../elements'
import { uiScalarInput } from './scalar'

export type VectorWidgetAttrs<T = unknown> = CommonWidgetAttrs & VectorInputAttrs<T>

/**
 * Vector component model
 * @public
 */
export type VectorInputAttrs<T = unknown> = TweakableAttrs<T, any> & {
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
  readonly?: boolean
}

export function uiVectorWidget<T>(
  attrs: VectorWidgetAttrs<T>,
  children?: Children,
): Vnode<VectorWidgetAttrs<T>> {
  return m(VectorWidgetComponent as any, attrs as any, children)
}

export function uiVectorInput<T>(
  attrs: VectorInputAttrs<T>,
  children?: Children,
): Vnode<VectorInputAttrs<T>> {
  return m(VectorInputComponent as any, attrs as any, children)
}

export const VectorWidgetComponent: FactoryComponent<VectorWidgetAttrs> = () => {
  return {
    view: ({ attrs: { label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: 'label.twk-vector-widget',
          label: label ?? rest.field,
          class: className,
        },
        [m(VectorInputComponent, rest)],
      )
    },
  }
}
const defaultKeys = ['x', 'y', 'z']
export const VectorInputComponent: FactoryComponent<VectorInputAttrs> = () => {
  function onchange(type: 'input' | 'change', field: string, v: number, attrs: VectorInputAttrs) {
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
      return m(
        'div.twk-vector-input',
        {
          style: {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          },
        },
        keys.map((field) => {
          return uiScalarInput({
            min: attrs.min,
            max: attrs.max,
            step: attrs.step,
            value,
            field,
            readonly: attrs.readonly,
            slotBefore: attrs.unlabeled ? null : m('span.twk-color-muted', field),
            oninput: (_, v) => onchange('input', field, v as number, attrs),
            onchange: (_, v) => onchange('change', field, v as number, attrs),
            placeholder: field,
          })
        }),
      )
    },
  }
}
