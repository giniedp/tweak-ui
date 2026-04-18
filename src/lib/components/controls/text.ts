import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { ControlValue, getControlValue, setControlValue } from '../../core'
import { call, twuiClass } from '../../core/utils'
import { ControlAttrs, ControlComponent } from './control'

/**
 * Text component model
 * @public
 */
export interface TextAttrs<T = unknown> extends ControlValue<T, string>, ControlAttrs {
  /**
   * The placeholder text
   */
  placeholder?: string

  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: T, value: string) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: T, value: string) => void

  /**
   * Disables the control input
   */
  disabled?: boolean
}

export function uiText<T>(attrs: TextAttrs<T>, children?: Children): Vnode<TextAttrs<T>> {
  return m(TextComponent as any, attrs as any, children)
}

export const TextComponent: FactoryComponent<TextAttrs> = () => {
  let attrs: TextAttrs
  function onChange(e: Event) {
    const el = e.target as HTMLInputElement
    const value = el.value
    setControlValue(attrs, value)
    call(e.type === 'input' ? attrs.onInput : attrs.onChange, attrs.value, value)
  }

  return {
    view: (node) => {
      attrs = node.attrs
      return m(
        ControlComponent,
        {
          label: attrs.label,
          description: attrs.description,
          class: twuiClass('text'),
        },
        m("input[type='text']", {
          value: getControlValue(attrs),
          oninput: onChange,
          onchange: onChange,
          placeholder: attrs.placeholder,
          disabled: attrs.disabled,
        }),
      )
    },
  }
}
