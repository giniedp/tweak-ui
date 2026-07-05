import m, { Attributes, Children, FactoryComponent, Vnode } from 'mithril'
import { StyleAttr } from '../../core'

/**
 * List component model
 * @public
 */
export type ListAttrs = Attributes & {
  /**
   * Maps to flex-flow CSS property.
   * @links https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-flow
   */
  flow?: `row` | `column` | string
  /**
   * Maps to flex CSS property.
   * @links https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex
   */
  flex?: string | number
  /**
   * Custom CSS Style
   */
  style?: StyleAttr
}

export function uiFlex<T>(attrs: ListAttrs, children?: Children): Vnode<ListAttrs> {
  return m(FlexComponent, attrs, children)
}

export const FlexComponent: FactoryComponent<ListAttrs> = () => {
  return {
    view: ({ attrs: { flex, flow, style, ...rest }, children }) => {
      return m(
        'div.twk-flex',
        {
          style: {
            flex: flex ?? 'auto',
            flexFlow: flow || 'column nowrap',
            ...(style || {}),
          },
          ...rest,
        },
        children,
      )
    },
  }
}
