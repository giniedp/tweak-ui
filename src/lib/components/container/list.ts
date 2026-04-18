import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { cssClass, twuiClass } from '../../core/utils'

/**
 * List component model
 * @public
 */
export interface ListAttrs {
  /**
   * Enables horizontal layout
   */
  horizontal?: boolean
  /**
   * Custom CSS Style
   */
  style?: Partial<CSSStyleDeclaration>
}

export function uiList<T>(attrs: ListAttrs, children?: Children): Vnode<ListAttrs> {
  return m(ListComponent, attrs, children)
}

export const ListComponent: FactoryComponent<ListAttrs> = () => {
  return {
    view: (node) => {
      const data = node.attrs
      return m(
        'div',
        {
          class: cssClass({
            [twuiClass('list')]: true,
            [twuiClass('list', 'horizontal')]: !!data.horizontal,
          }),
          style: data.style,
        },
        node.children,
      )
    },
  }
}
