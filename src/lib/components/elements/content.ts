import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { ControlAttrs, ControlComponent } from '../controls/control'

/**
 * Content component model
 * @public
 */
export interface ContentAttrs extends ControlAttrs {
  /**
   * A mithril child
   */
  content?: Children | (() => Children)

  /**
   * If true, the content will be rendered in a monospace font and preserve whitespace, making it suitable for displaying code snippets or JSON data.
   */
  code?: boolean
}

export function uiContent(attrs: ContentAttrs, children?: Children): Vnode<ContentAttrs> {
  return m(Content, attrs, children)
}

export const Content: FactoryComponent<ContentAttrs> = () => {
  return {
    view: (node) => {
      const code = node.attrs.code
      const content = node.attrs.content
      const children = [typeof content === 'function' ? content() : content, node.children]
      return m(
        ControlComponent,
        {
          label: node.attrs.label,
          description: node.attrs.description,
        },
        code ? m('pre', {}, children) : children,
      )
    },
  }
}
