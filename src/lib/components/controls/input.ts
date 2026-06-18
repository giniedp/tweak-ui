import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue } from '../../core'
import { uiControl, ValueControlAttrs } from '../elements'

/**
 * Basic input component model
 * @public
 */
export interface InputAttrs<T = unknown> extends ValueControlAttrs<T, string> {
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
   *
   */
  type?: string
}

export function uiInput<T>(attrs: InputAttrs<T>, children?: Children): Vnode<InputAttrs<T>> {
  return m(InputComponent as any, attrs as any, children)
}

export const InputComponent: FactoryComponent<InputAttrs> = () => {
  let attrs: InputAttrs
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
      return uiControl(
        {
          tagName: 'label.twui-input',
          label: attrs.label,
          description: attrs.description,
          class: attrs.class,
        },
        m('input', {
          type: attrs.type || 'text',
          value: getControlValue(attrs),
          oninput: onchange,
          onchange: onchange,
          placeholder: attrs.placeholder,
          disabled: attrs.disabled,
        }),
      )
    },
  }
}
