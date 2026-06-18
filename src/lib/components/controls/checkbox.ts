import m, { Child, Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue } from '../../core'
import { uiClass } from '../../core/utils'
import { uiControl, ValueControlAttrs } from '../elements'

/**
 * Describes a checkbox control
 * @public
 */
export interface BooleanAttrs<T = unknown> extends ValueControlAttrs<T, boolean> {
  /**
   * This is called when the control value changes
   */
  onchange?: (model: T, value: boolean) => void

  /**
   * This is called when the control value changes
   */
  oninput?: (model: T, value: boolean) => void

  /**
   * Text behind the checkbox or inside the button
   */
  text?: Child

  /**
   * Disables the control input
   */
  disabled?: boolean

  /**
   * Whether to use a toggle button style instead of a checkbox. By default, this is false (checkbox style).
   */
  toggle?: boolean

  /**
   * Aligns the checkbox to the start or end of the control.
   * By default, the checkbox is placed at the end of the control.
   */
  align?: 'start' | 'end'
}

export function uiBoolean<T>(attrs: BooleanAttrs<T>, children?: Children): Vnode<BooleanAttrs<T>> {
  return m(BooleanComponent as any, attrs as any, children)
}

export const BooleanComponent: FactoryComponent<BooleanAttrs> = () => {
  let attrs: BooleanAttrs

  function onchange(e: Event) {
    const value = (e.target as HTMLInputElement).checked
    setControlValue(attrs, value)
    attrs.oninput?.(attrs.value, value)
    attrs.onchange?.(attrs.value, value)
  }

  return {
    view: (node) => {
      attrs = node.attrs
      const checked = getControlValue(attrs) === true
      const alignStart = attrs.align === 'start'
      return uiControl(
        {
          tagName: 'label.twui-checkbox',
          label: attrs.label,
          description: attrs.description,
          class: uiClass(
            {
              checked,
              disabled: !!attrs.disabled,
            },
            attrs.class,
          ),
          contentStyle: {
            marginLeft: alignStart ? void 0 : 'auto',
          },
        },
        [
          alignStart ? null : attrs.text,
          m('input', {
            class: uiClass({
              'twui-toggle': !!attrs.toggle,
            }),
            type: 'checkbox',
            checked: checked,
            onchange: onchange,
            disabled: attrs.disabled,
          }),
          alignStart ? attrs.text : null,
          node.children,
        ],
      )
    },
  }
}
