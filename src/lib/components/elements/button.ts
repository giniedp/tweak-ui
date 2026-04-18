import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { call, twuiClass } from '../../core/utils'

/**
 * Button component model
 * @public
 */
export interface ButtonAttrs {
  /**
   * The button text
   */
  text?: string

  /**
   * This is callend when the control is clicked
   */
  onClick?: (ctrl: ButtonAttrs) => void

  /**
   * Disables the control input
   */
  disabled?: boolean
}

export function uiButton<T>(attrs: ButtonAttrs, children?: Children): Vnode<ButtonAttrs> {
  return m(ButtonComponent as any, attrs as any, children)
}

export const ButtonComponent: FactoryComponent<ButtonAttrs> = () => {
  return {
    view: ({ attrs }) => {
      return m(
        'button',
        {
          type: 'button',
          class: twuiClass('button'),
          onclick: () => call(attrs.onClick, attrs),
          disabled: !!attrs.disabled,
        },
        attrs.text,
      )
    },
  }
}
