import { Children, FactoryComponent, default as m, Vnode } from 'mithril'

import { mapChildren } from '../../core'
import { cssClass, twuiClass } from '../../core/utils'
import { GroupAttrs } from './group'

/**
 * Tabs component model
 * @public
 */
export interface TabsAttrs {
  //
}

const tabsHost = Symbol('tabsHost')

export interface TabsHost {
  attach(node: Vnode<TabAttrs>): void
  detach(node: Vnode<TabAttrs>): void
  activate(node: Vnode<TabAttrs>): void
  isActive(child: Vnode<TabAttrs>): boolean
}

export interface TabAttrs {
  title: string
  active?: boolean
  disabled?: boolean
}

export const TabComponent: FactoryComponent<TabAttrs> = () => {
  let host: TabsHost
  let vnode: Vnode<TabAttrs>
  return {
    oninit: (node) => {
      host = (node.attrs as any)[tabsHost]
      vnode = node
      if (!host) {
        throw new Error('TabPane must be used inside a Tabs component')
      }
      host.attach(node)
    },
    onremove: () => {
      host.detach(vnode)
    },
    view: ({ attrs, children }) => {
      const title = attrs.title
      const active = host.isActive(vnode)
      return [
        m(
          'button',
          {
            class: cssClass(twuiClass('tab'), { active }),
            onclick: () => host.activate(vnode),
          },
          title,
        ),
        !active ? null : m('div', { class: cssClass(twuiClass('tab-content')) }, children),
      ]
    },
  }
}

export function uiTabs<T>(attrs: TabsAttrs, children?: Children): Vnode<TabsAttrs> {
  return m(Tabs, attrs, children)
}

export const Tabs: FactoryComponent<TabsAttrs> = () => {
  const children: Vnode<TabAttrs>[] = []
  let active: Vnode<TabAttrs> | null = null
  const host: TabsHost = {
    attach(child) {
      children.push(child)
      if (child.attrs.active) {
        active = child
      }
    },
    detach(child) {
      const index = children.indexOf(child)
      if (index >= 0) {
        children.splice(index, 1)
      }
      if (active === child) {
        active = children[0] || null
      }
    },
    activate(child) {
      active = child
    },
    isActive(child) {
      return active === child
    },
  }

  function tabChildren(node: Vnode<TabsAttrs>) {
    return mapChildren(node.children, (child) => {
      if (!child) {
        return child
      }
      if (child.tag === TabComponent) {
        return m(
          child.tag as any,
          {
            ...child.attrs,
            [tabsHost]: host,
          },
          child.children,
        )
      }
      // assume the child is a group and wrap it in a tab
      // pull the title from the group attrs
      const attrs = child.attrs as GroupAttrs
      return m(
        TabComponent,
        {
          title: attrs.title || '',
          ...{ [tabsHost]: host },
        },
        m(
          child.tag as any,
          {
            ...attrs,
            title: undefined,
          },
          child.children,
        ),
      )
    })
  }

  return {
    view: (node) => {
      // const data = node.attrs
      // const tabs = data.children || []
      // const active = clamp(data.active || 0, 0, tabs.length - 1)
      // const tab = tabs[active]
      return m(
        'div',
        {
          class: twuiClass('tabs'),
        },
        m.fragment({}, [tabChildren(node)]),
      )
    },
  }
}
