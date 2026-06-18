import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue } from '../../core'
import { uiControl, ValueControlAttrs } from '../elements'

/**
 * Text component model
 * @public
 */
export interface TextAttrs<T = unknown> extends ValueControlAttrs<T, string> {
  /**
   * The placeholder text
   */
  placeholder?: string

  /**
   * This is called when the control value has been changed.
   */
  oninput?: (model: T, value: string) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: T, value: string) => void

  /**
   * Disables the control input
   */
  disabled?: boolean

  /**
   * The number of rows for a textarea. If not specified, a single-line input will be used.
   */
  rows?: number
}

export function uiText<T>(attrs: TextAttrs<T>, children?: Children): Vnode<TextAttrs<T>> {
  return m(TextComponent as any, attrs as any, children)
}

export function uiString<T>(attrs: TextAttrs<T>, children?: Children): Vnode<TextAttrs<T>> {
  return m(TextComponent as any, attrs as any, children)
}

export const TextComponent: FactoryComponent<TextAttrs> = () => {
  let attrs: TextAttrs
  function onchange(e: Event) {
    const el = e.target as HTMLInputElement
    const value = el.value
    setControlValue(attrs, value)
    const cb = e.type === 'input' ? attrs.oninput : attrs.onchange
    cb?.(attrs.value, value)
  }

  return {
    view: (node) => {
      attrs = node.attrs
      const editable = !attrs.disabled
      const value = getControlValue(attrs)
      return uiControl(
        {
          tagName: 'label.twui-text',
          label: attrs.label,
          description: attrs.description,
          class: attrs.class,
        },
        m(
          !editable ? 'div' : attrs.rows ? 'textarea' : "input[type='text']",
          {
            value: value,
            oninput: onchange,
            onchange: onchange,
            placeholder: attrs.placeholder,
            disabled: attrs.disabled,
            rows: attrs.rows,
          },
          editable ? null : value,
        ),
      )
    },
  }
}
