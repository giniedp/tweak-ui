import m, { Attributes, FactoryComponent, Vnode } from 'mithril'

export function uiDivider(attrs: Attributes): Vnode<Attributes> {
  return m(Divider, attrs)
}

export const Divider: FactoryComponent<Attributes> = () => {
  return {
    view: (node) => {
      return m('div.twui-divider', node.attrs, node.children)
    },
  }
}
