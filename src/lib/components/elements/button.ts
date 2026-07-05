import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { EventAttrs, StyleAttr } from '../../core'
import { uiClass } from '../../core/utils'

/**
 * Button component model
 * @public
 */
export type ButtonAttrs = EventAttrs & {
  [key: string]: any

  /**
   *
   */
  style?: StyleAttr
  /**
   * Whether the button square
   */
  square?: boolean

  /**
   * Whether the button a block
   */
  block?: boolean

  /**
   * Whether the button is large
   */
  large?: boolean

  /**
   *
   */
  accent?: boolean

  /**
   * Css flex property
   */
  flex?: string
}

export function uiButton<T>(attrs: ButtonAttrs, children?: Children): Vnode<ButtonAttrs> {
  return m(ButtonComponent as any, attrs as any, children)
}

export const ButtonComponent: FactoryComponent<ButtonAttrs> = () => {
  return {
    view: ({ attrs, children }) => {
      const { square, block, class: className, style, ...rest } = attrs
      return m(
        'button.twk-btn',
        {
          type: 'button',
          class: uiClass(
            {
              'twk-btn-sq': !!square,
              'twk-btn-bl': !!block,
              'twk-btn-lg': !!attrs.large,
              'twk-btn-accent': !!attrs.accent,
            },
            className,
          ),
          style: {
            flex: attrs.flex,
            ...(style || {}),
          },
          ...rest,
        },
        children,
      )
    },
  }
}
