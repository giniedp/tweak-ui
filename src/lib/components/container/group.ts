import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { ClassValue, uiClass, eventWithTimout } from '../../core/utils'

/**
 * Group component model
 * @public
 */
export interface GroupAttrs {
  /**
   * Group title
   */
  title?: string
  /**
   * Group CSS Style
   */
  style?: Partial<CSSStyleDeclaration>
  /**
   * Additional CSS class for the group element
   */
  class?: ClassValue
  /**
   * Whether the child elements can be collapsed
   */
  collapsible?: boolean
  /**
   * Whether the child elements are collapsed
   */
  collapsed?: boolean
  /**
   * WHether the group is disabled. Disabled groups can not be expanded.
   */
  disabled?: boolean
  /**
   * Adds an offset to the left side
   */
  inset?: boolean
  /**
   * Is called when this Group has been collapsed or expanded
   */
  onToggle?: (node: Vnode<GroupAttrs>) => void
  /**
   * Is called when this Group has been expanded
   */
  onExpand?: (node: Vnode<GroupAttrs>) => void
  /**
   * Is called when this Group has been collapsed
   */
  onCollapse?: (node: Vnode<GroupAttrs>) => void
}

export function uiGroup<T>(attrs: GroupAttrs, children?: Children): Vnode<GroupAttrs> {
  return m(GroupComponent, attrs, children)
}

export const GroupComponent: FactoryComponent<GroupAttrs> = () => {
  let title: string
  let collapsible: boolean
  let collapsed: boolean
  let animate = false

  function updateState(node: Vnode<GroupAttrs>) {
    const data = node.attrs
    title = data.title || ''
    collapsible = !!data.collapsible
    collapsed ??= !!data.collapsed
  }

  function handleToggle() {
    animate = true
    collapsed = !collapsed
  }

  function groupTitle() {
    if (!title && !collapsible) {
      return null
    }
    return m(
      'div.twui-group-title',
      {
        onclick: collapsible ? handleToggle : undefined,
      },
      title,
    )
  }

  return {
    oninit: updateState,
    onupdate: updateState,
    view: ({ attrs, children }) => {
      return m(
        'div.twui-group',
        {
          class: uiClass({
            ['twui-group-collapsible']: !!collapsible,
            ['twui-group-collapsed']: !!collapsed,
          }),
          style: attrs.style,
        },
        m.fragment({}, [groupTitle()]),
        collapsed ? null : m(GroupContent, { animate }, children),
      )
    },
  }
}

const GroupContent: FactoryComponent<{ animate: boolean }> = () => {
  return {
    onbeforeremove: async ({ dom }) => {
      dom.classList.remove('enter')
      dom.classList.add('leave')
      if (await eventWithTimout(dom, 'animationstart', 50)) {
        await eventWithTimout(dom, 'animationend', 2000)
      }
    },
    view: ({ children, attrs }) => {
      return m(
        'div.twui-group-content',
        {
          class: uiClass({
            animate: attrs.animate,
            enter: true,
          }),
        },
        children,
      )
    },
  }
}
