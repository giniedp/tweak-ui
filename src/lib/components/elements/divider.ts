import m, { FactoryComponent, Vnode } from 'mithril'
import { twuiClass } from '../../core/utils'

/**
 * Divider component model
 *
 * @public
 */
export interface DividerAttrs {
  text?: string
}

export function uiDivider(attrs: DividerAttrs): Vnode<DividerAttrs> {
  return m(Divider, attrs)
}

export const Divider: FactoryComponent<DividerAttrs> = () => {
  return {
    view: ({ attrs: { text }, children }) => {
      return m('div', { class: twuiClass('divider') }, text ?? null, children)
    },
  }
}
