import { Attributes, Children, FactoryComponent, default as m, Vnode } from 'mithril'

/**
 * Bar component model
 * @public
 */
export type BarAttrs = Attributes & {
  /**
   * Custom CSS Style
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * Start children
   */
  start?: Children

  /**
   * End children
   */
  end?: Children
}

export function uiBar<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(BarComponent, attrs, children)
}

export function uiBarStart<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(BarStartComponent, attrs, children)
}

export function uiBarEnd<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(BarEndComponent, attrs, children)
}

export function uiBarContent<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(BarContentComponent, attrs, children)
}

export const BarComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs: { start, end, ...rest }, children }) => {
      return m('div.twui-bar', rest, [
        start ? m(BarStartComponent, start) : null,
        children,
        end ? m(BarEndComponent, end) : null,
      ])
    },
  }
}

export const BarStartComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('div.twui-bar-start', attrs, children)
    },
  }
}

export const BarEndComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('div.twui-bar-end', attrs, children)
    },
  }
}

export const BarContentComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('div.twui-bar-content', attrs, children)
    },
  }
}
