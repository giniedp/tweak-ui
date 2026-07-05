import m, { Child, FactoryComponent, Vnode } from 'mithril'
import { uiClass } from '../../core/utils'

export interface TreeAttrs<T> {
  data: Iterable<T>
  adapter: TreeDataAdapter<T>
  selectedId?: string
  rowHeight?: number
  style?: Partial<CSSStyleDeclaration>
  onSelect?: (node: T) => void
}

export interface TreeDataAdapter<T> {
  version: number
  nodeId(node: T): string
  nodeLabel(node: T): Child
  nodeIcon(node: T, expanded: boolean): Child
  nodeChildren(node: T): Iterable<T> | undefined
  isExpanded(node: T): boolean
  setExpanded(node: T, expanded: boolean): void
  connect?(controller: TreeController<T>): void
}

export interface TreeController<T> {
  scrollTo(node: T): void
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
  depth = 0,
  result: FlatNode<T>[] = [],
): FlatNode<T>[] {
  for (const node of data) {
    const expanded = adapter.isExpanded(node) ?? false
    const children = adapter.nodeChildren(node)
    result.push({ node, depth, expanded })
    if (!!children && expanded) {
      flattenTree(children, adapter, depth + 1, result)
    }
  }
  return result
}

const ROW_HEIGHT = 22
export const TreeComponent: FactoryComponent<TreeAttrs<any>> = () => {
  let scrollTop = 0
  let observer: ResizeObserver | null = null
  let height = 0
  let nodes: FlatNode<any>[] = []
  let treeVersion: number | undefined
  let adapter: TreeDataAdapter<any> | null = null
  let selectedId: string | undefined
  let rowHeight: number | undefined
  let onSelect: ((node: any) => void) | undefined
  let data: Iterable<any> = []
  let scrollEl: HTMLElement | null = null
  return {
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
    onupdate({ attrs: { adapter } }) {
      adapter.connect?.({
        scrollTo(node) {
          const index = nodes.findIndex((it) => it.node === node)
          if (index >= 0) {
            scrollEl?.scrollTo({
              top: index * (rowHeight ?? ROW_HEIGHT),
              behavior: 'instant',
            })
            m.redraw()
          }
        },
      })
    },
    view({ attrs }) {
      data = attrs.data!
      adapter = attrs.adapter!
      selectedId = attrs.selectedId!
      rowHeight = attrs.rowHeight ?? ROW_HEIGHT
      onSelect = attrs.onSelect

      if (treeVersion == null || treeVersion !== adapter.version) {
        nodes = flattenTree(data, adapter)
      }

      const totalRows = nodes.length
      const visibleRows = Math.ceil(height / rowHeight)
      const startIdx = Math.floor(scrollTop / rowHeight)
      const endIdx = Math.min(startIdx + visibleRows, totalRows)
      const offsetY = startIdx * rowHeight
      const childNodes = nodes.slice(startIdx, endIdx)
      return m(
        'div.twk-tree',
        {
          style: attrs.style ?? {},
          oncreate: ({ dom }) => {
            scrollEl = dom as HTMLElement
          },
          onscroll: (e: UIEvent) => {
            scrollTop = (e.target as HTMLElement).scrollTop
          },
        },
        m(
          'div.twk-tree-spacer',
          {
            style: {
              height: `${totalRows * rowHeight}px`,
            },
          },
          m(
            'div.twk-tree-viewport',
            {
              style: {
                '--twk-tree-row-height': `${rowHeight}px`,
                transform: `translateY(${offsetY}px)`,
              },
            },
            childNodes.map(({ node, depth, expanded }) => {
              const id = adapter!.nodeId(node)
              const isSelected = id === selectedId
              const icon = adapter!.nodeIcon(node, adapter!.isExpanded(node))
              const isExpandable = !!adapter!.nodeChildren(node)
              return m(
                'div.twk-tree-row',
                {
                  key: id,
                  class: uiClass({
                    selected: isSelected,
                    expandable: isExpandable,
                  }),
                  style: {
                    height: `${rowHeight}px`,
                    '--twk-tree-row-depth': depth,
                  },
                  onclick: () => onSelect?.(node),
                },
                [
                  m('span.twk-tree-toggle', {
                    class: uiClass({ expanded, expandable: isExpandable }),
                    onclick: (e: MouseEvent) => {
                      if (isExpandable) {
                        e.stopPropagation()
                        adapter!.setExpanded(node, !expanded)
                      }
                    },
                  }),
                  icon ? m('span.twk-tree-icon', {}, icon) : null,
                  m('span.twk-tree-label', {}, adapter!.nodeLabel(node)),
                ],
              )
            }),
          ),
        ),
      )
    },
  }
}
