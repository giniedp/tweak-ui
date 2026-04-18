import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { ControlValue, getControlValue, setControlValue } from '../../core'
import { call, twuiClass } from '../../core/utils'
import { ControlAttrs, ControlComponent } from './control'

/**
 * Describes a checkbox control
 * @public
 */
export interface ChecboxAttrs<T = unknown> extends ControlValue<T, boolean>, ControlAttrs {
  /**
   * This is called when the control value changes
   */
  onChange?: (model: T, value: boolean) => void

  /**
   * Text behind the checkbox or inside the button
   */
  text?: string

  /**
   * Disables the control input
   */
  disabled?: boolean
}

export function uiCheckbox<T>(attrs: ChecboxAttrs<T>, children?: Children): Vnode<ChecboxAttrs<T>> {
  return m(CheckboxComponent as any, attrs as any, children)
}

export const CheckboxComponent: FactoryComponent<ChecboxAttrs> = () => {
  let attrs: ChecboxAttrs

  function onChange(e: Event) {
    const value = (e.target as HTMLInputElement).checked
    setControlValue(attrs, value)
    call(attrs.onChange, attrs.value, value)
  }
  return {
    view: (node) => {
      attrs = node.attrs
      const checked = getControlValue(attrs) === true
      return m(
        ControlComponent,
        {
          label: attrs.label,
          description: attrs.description,
          class: [twuiClass('checkbox'), { checked, disabled: !!attrs.disabled }],
          style: attrs.style,
        },
        m('span', {}, [
          attrs.text,
          m('input', {
            type: 'checkbox',
            checked: checked,
            onchange: onChange,
            disabled: attrs.disabled,
          }),
        ]),
      )
    },
  }
}
