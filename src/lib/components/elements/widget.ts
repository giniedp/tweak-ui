import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { EventAttrs, StyleAttr, TweakableAttrs } from '../../core'

export type WidgetAttrs = EventAttrs &
  CommonWidgetAttrs & {
    [property: string]: any

    /**
     * The HTML tag to use for the control container, defaults to 'div'
     */
    tagName?: string

    /**
     * Style object to apply to the control container
     */
    style?: StyleAttr
  }

export interface CommonWidgetAttrs {
  /**
   * The HTML tag to use for the control container, defaults to 'div'
   */
  tagName?: string

  /**
   * A label for the control
   */
  label?: Children | false

  /**
   * Additional CSS class names to apply to the control container
   */
  class?: string
}

export type ValueWidgetAttrs<T = any, V = any> = CommonWidgetAttrs & TweakableAttrs<T, V>

export const WidgetComponent: FactoryComponent<WidgetAttrs> = () => {
  return {
    view: (node) => {
      const { label, tip, tagName, ...rest } = node.attrs
      return [
        m(
          `${tagName || 'div'}.twk-widget`,
          {
            ...rest,
          },
          label === false ? null : m('div.twk-widget-label', {}, label),
          node.children,
        ),
      ]
    },
  }
}

export function uiWidget(attrs: WidgetAttrs, children?: Children): Vnode<WidgetAttrs> {
  return m(WidgetComponent, attrs, children)
}
