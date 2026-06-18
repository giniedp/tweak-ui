import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { EventAttrs, StyleAttr, ValueField } from '../../core'

export interface ControlAttrs extends EventAttrs, CommonControlAttrs {
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

export interface CommonControlAttrs {
  /**
   * A label for the control
   */
  label?: Children

  /**
   * A description for the control
   */
  description?: Children

  /**
   * Additional CSS class names to apply to the control container
   */
  class?: string

  /**
   * Style object to apply to the display container
   */
  contentStyle?: StyleAttr
}

export type ValueControlAttrs<T = any, V = any> = CommonControlAttrs & ValueField<T, V>

export const ControlComponent: FactoryComponent<ControlAttrs> = () => {
  return {
    view: (node) => {
      const { label, description, tagName, contentStyle, ...rest } = node.attrs
      return [
        m(
          `${tagName || 'div'}.twui-ctrl`,
          {
            ...rest,
          },
          label != null ? m('div.twui-ctrl-label', {}, label) : null,
          m('div.twui-ctrl-content', { style: contentStyle }, node.children),
        ),
        description ? m('div.twui-ctrl-description', {}, description) : null,
      ]
    },
  }
}

export function uiControl(attrs: ControlAttrs, children?: Children): Vnode<ControlAttrs> {
  return m(ControlComponent, attrs, children)
}
