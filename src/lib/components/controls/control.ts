import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { ClassValue, cssClass, twuiClass } from '../../core/utils'

export interface ControlAttrs {
  [property: string]: any

  tag?: string

  /**
   * A label for the control
   */
  label?: string

  /**
   * A description for the control
   */
  description?: string | null

  style?: Record<string, any>

  class?: ClassValue | null

  content?: Children | (() => Children)
}

function extract(attrs: ControlAttrs) {
  const { label, description, content, tag, class: className, ...rest } = attrs
  return { label, description, content, tag, className, rest }
}

export const ControlComponent: FactoryComponent<ControlAttrs> = () => {
  return {
    view: (node) => {
      const { label, description, content, tag, className, rest } = extract(node.attrs)
      return [
        m(
          tag || 'label',
          {
            ...rest,
            class: cssClass(twuiClass('control'), className),
          },
          m.fragment({}, [
            label != null ? m('div', { class: twuiClass('control-label') }, label) : null,
            typeof content === 'function' ? content() : content,
            node.children,
          ]),
        ),
        description ? m('div', { class: twuiClass('control-description') }, description) : null,
      ]
    },
  }
}

export function uiControl(attrs: ControlAttrs, children?: Children): Vnode<ControlAttrs> {
  return m(ControlComponent, attrs, children)
}
