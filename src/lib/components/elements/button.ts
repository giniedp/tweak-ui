import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { EventAttrs } from '../../core'
import { uiClass } from '../../core/utils'

/**
 * Button component model
 * @public
 */
export interface ButtonAttrs extends EventAttrs {
  [key: string]: any

  /**
   * Whether the button square
   */
  square?: boolean

  /**
   * Whether the button a block
   */
  block?: boolean
}

export function uiButton<T>(attrs: ButtonAttrs, children?: Children): Vnode<ButtonAttrs> {
  return m(ButtonComponent as any, attrs as any, children)
}

export const ButtonComponent: FactoryComponent<ButtonAttrs> = () => {
  return {
    view: ({ attrs, children }) => {
      const { square, block, class: className, ...rest } = attrs
      return m(
        'button.twui-btn',
        {
          type: 'button',
          class: uiClass(
            {
              'twui-btn-square': !!square,
              'twui-btn-block': !!block,
            },
            className,
          ),
          ...rest,
        },
        children,
      )
    },
  }
}
