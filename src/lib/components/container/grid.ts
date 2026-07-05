import m, { Children, FactoryComponent, Vnode } from 'mithril'

/**
 * Grid component model
 * @public
 */
export type GridAttrs = {
  /**
   * Grit template columns specification, e.g. "1fr 2fr 1fr" or "3"
   */
  columns?: number | string
  /**
   * Grit template rows specification
   */
  rows?: number | string
  /**
   * Custom CSS Style
   */
  style?: Partial<CSSStyleDeclaration>
}

export function uiGrid<T>(attrs: GridAttrs, children?: Children): Vnode<GridAttrs> {
  return m(GridComponent, attrs, children)
}

export const GridComponent: FactoryComponent<GridAttrs> = () => {
  return {
    view: (node) => {
      const data = node.attrs
      return m(
        'div.twk-grid',
        {
          style: {
            gridTemplateColumns:
              typeof data.columns === 'number'
                ? `repeat(${data.columns}, 1fr)`
                : data.columns || 'none',
            gridTemplateRows:
              typeof data.rows === 'number' ? `repeat(${data.rows}, 1fr)` : data.rows || 'none',
            ...(data.style || {}),
          },
        },
        node.children,
      )
    },
  }
}
