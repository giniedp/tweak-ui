import m, { Attributes, Children, FactoryComponent, Vnode } from 'mithril'

/**
 * Page component model
 * @public
 */
export type SectionAttrs = Attributes & {
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

export function uiSection<T>(attrs: SectionAttrs, children?: Children): Vnode<SectionAttrs> {
  return m(SectionComponent, attrs, children)
}

export function uiSectionHeader<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(SectionHeaderComponent, attrs, children)
}

export function uiSectionFooter<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(SectionFooterComponent, attrs, children)
}

export function uiSectionContent<T>(attrs: Attributes, children?: Children): Vnode<Attributes> {
  return m(SectionContentComponent, attrs, children)
}

export const SectionComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs: { header, footer, ...rest }, children }) => {
      return m('div.twk-section', rest, [
        header ? m(SectionHeaderComponent, header) : null,
        children,
        footer ? m(SectionFooterComponent, footer) : null,
      ])
    },
  }
}

export const SectionHeaderComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('header.twk-section-header', attrs, children)
    },
  }
}

export const SectionFooterComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('footer.twk-section-footer', attrs, children)
    },
  }
}

export const SectionContentComponent: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs, children }) => {
      return m('main.twk-section-content', attrs, children)
    },
  }
}
