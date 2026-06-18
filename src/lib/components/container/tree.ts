import m, { Child, FactoryComponent, Vnode } from 'mithril'
import { uiClass } from '../../core/utils'

export interface TreeAttrs<T> {
  adapter: TreeDataAdapter<T>
  data: T[]
  selectedId?: string
  rowHeight?: number
  style?: Partial<CSSStyleDeclaration>
  onSelect?: (node: T) => void
}

export interface TreeDataAdapter<T> {
  getId(node: T): string
  getLabel(node: T): Child
  getIcon(node: T): Child
  getChildren(node: T): Iterable<T> | undefined
  isExpandable(node: T): boolean
}

export function uiTree<T>(attrs: TreeAttrs<T>): Vnode<TreeAttrs<T>> {
  return m(TreeComponent, attrs)
}

interface FlatNode<T> {
  node: T
  depth: number
  expanded: boolean
}

function flattenTree<T>(
  data: Iterable<T>,
  adapter: TreeDataAdapter<T>,
  expandedMap: Map<string, boolean>,
  depth = 0,
  result: FlatNode<T>[] = [],
): FlatNode<T>[] {
  for (const node of data) {
    const id = adapter.getId(node)
    const expanded = expandedMap.get(id) ?? false
    result.push({ node, depth, expanded })
    if (adapter.isExpandable(node) && expanded) {
      const children = adapter.getChildren(node)
      if (children) {
        flattenTree(children, adapter, expandedMap, depth + 1, result)
      }
    }
  }
  return result
}

export const TreeComponent: FactoryComponent<TreeAttrs<any>> = () => {
  let expandedMap = new Map<string, boolean>()
  let scrollTop = 0
  let observer: ResizeObserver | null = null
  let height = 0
  return {
    oninit() {
      expandedMap = new Map()
    },
    onremove() {
      observer?.disconnect()
    },
    oncreate({ dom }) {
      observer = new ResizeObserver((entries) => {
        let newHeight = entries[0].contentRect.height
        if (newHeight !== height) {
          height = newHeight
          m.redraw()
        }
      })
      observer.observe(dom)
    },
    view(vnode) {
      const { adapter, data, selectedId, onSelect, style, rowHeight = 32 } = vnode.attrs
      const flatNodes = flattenTree(data, adapter, expandedMap)
      const totalRows = flatNodes.length
      const visibleRows = Math.ceil(height / rowHeight)
      const startIdx = Math.floor(scrollTop / rowHeight)
      const endIdx = Math.min(startIdx + visibleRows, totalRows)
      const offsetY = startIdx * rowHeight
      const childNodes = flatNodes.slice(startIdx, endIdx)
      return m(
        'div.twui-tree',
        {
          style,
          onscroll: (e: UIEvent) => {
            scrollTop = (e.target as HTMLElement).scrollTop
          },
        },
        m(
          'div.twui-tree-spacer',
          {
            style: {
              height: `${totalRows * rowHeight}px`,
            },
          },
          m(
            'div.twui-tree-viewport',
            {
              style: {
                '--twui-tree-row-height': `${rowHeight}px`,
                transform: `translateY(${offsetY}px)`,
              },
            },
            childNodes.map(({ node, depth, expanded }) => {
              const id = adapter.getId(node)
              const isSelected = id === selectedId
              const icon = adapter.getIcon(node)
              const isExpandable = adapter.isExpandable(node)
              return m(
                'div.twui-tree-row',
                {
                  key: id,
                  class: uiClass({ selected: isSelected }),
                  style: {
                    height: `${rowHeight}px`,
                    '--twui-tree-row-depth': depth,
                  },
                  onclick: () => onSelect?.(node),
                },
                [
                  m('span.twui-tree-toggle', {
                    class: uiClass({ expanded, expandable: isExpandable }),
                    onclick: (e: MouseEvent) => {
                      if (isExpandable) {
                        e.stopPropagation()
                        expandedMap.set(id, !expanded)
                      }
                    },
                  }),
                  icon ? m('span.twui-tree-icon', {}, icon) : null,
                  m('span.twui-tree-label', {}, adapter.getLabel(node)),
                ],
              )
            }),
          ),
        ),
      )
    },
  }
}
