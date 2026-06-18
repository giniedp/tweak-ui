import m, { Attributes, Children, FactoryComponent, Vnode } from 'mithril'

/**
 * Page component model
 * @public
 */
export type PageAttrs = Attributes & {
  /**
   * Custom CSS Style
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * Header children
   */
  header?: Children

  /**
   * Footer children
   */
  footer?: Children
}

export function uiPage<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(PageComponent, attrs, children)
}

export function uiPageHeader<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(PageHeaderComponent, attrs, children)
}

export function uiPageFooter<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(PageFooterComponent, attrs, children)
}

export function uiPageContent<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(PageContentComponent, attrs, children)
}

export const PageComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs: { header, footer, ...rest }, children }) => {
      return m('div.twui-page', rest, [
        header ? m(PageHeaderComponent, header) : null,
        children,
        footer ? m(PageFooterComponent, footer) : null,
      ])
    },
  }
}

export const PageHeaderComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('header.twui-page-header', attrs, children)
    },
  }
}

export const PageFooterComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('footer.twui-page-footer', attrs, children)
    },
  }
}

export const PageContentComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('main.twui-page-content', attrs, children)
    },
  }
}
