import m, { Children, FactoryComponent, Vnode, VnodeDOM } from 'mithril'
import { EventAttrs, mapChildren, StyleAttr } from '../../core'
import { uiClass } from '../../core/utils'
import { h } from '../../mount'

/**
 * Split pane component model
 * @public
 */
export type SplitAttr = EventAttrs & {
  /**
   * Custom CSS Style
   */
  style?: StyleAttr
  /**
   * Whether the split is horizontal (side by side) or vertical (stacked)
   */
  flow?: 'row' | 'column'
  /**
   * Minimum size in pixels for each pane. Default is 16px.
   */
  minSize?: number
}

export function uiSplit<T>(attrs: SplitAttr, children?: Children): Vnode<SplitAttr> {
  return m(SplitComponent, attrs, children)
}

/**
 * Split pane component model
 * @public
 */
export type SplitContentAttr = EventAttrs & {
  [key: string]: any
  /**
   * Custom CSS Style
   */
  style?: StyleAttr
  /**
   *
   */
  fluid?: boolean
}

export function uiSplitContent<T>(attrs: SplitAttr, children?: Children): Vnode<SplitAttr> {
  return m(SplitContentComponent, attrs, children)
}

export const SplitContentComponent: FactoryComponent<SplitContentAttr> = (vnode) => {
  return {
    view: ({ attrs, children }) =>
      h(
        'div',
        {
          ...attrs,
          class: uiClass({ fluid: !!attrs.fluid }, attrs.class),
        },
        children,
      ),
  }
}

export const SplitComponent: FactoryComponent<SplitAttr> = () => {
  let isHorizontal = false
  let minSizePx = 0
  let startEvent!: MouseEvent | null
  let startBoxL!: DOMRect | null
  let startBoxR!: DOMRect | null
  let dragElemL!: HTMLElement | null
  let dragElemR!: HTMLElement | null
  let dragIndex: number
  let measured: number | null = null
  let container: HTMLElement | null = null

  function handleMouseDown(e: MouseEvent, index: number, childL: VnodeDOM, childR: VnodeDOM) {
    tearDown()
    e.stopPropagation()

    startEvent = e
    startBoxL = childL.dom?.getBoundingClientRect()
    startBoxR = childR.dom?.getBoundingClientRect()
    dragElemL = childL.dom as HTMLElement
    dragElemR = childR.dom as HTMLElement
    dragIndex = index

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', tearDown)

    const parent = dragElemL.parentElement as HTMLElement
    if (parent) {
      parent.classList.add('dragging')
    }
  }

  function handleMove(e: MouseEvent) {
    if (!startBoxL || !startBoxR || !startEvent || !dragElemL || !dragElemR) {
      return
    }

    if (measured == null) {
      measured = measurePanes()
    }

    const delta = isHorizontal ? e.clientX - startEvent.clientX : e.clientY - startEvent.clientY
    const baseL = isHorizontal ? startBoxL.width : startBoxL.height
    const baseR = isHorizontal ? startBoxR.width : startBoxR.height
    const total = baseL + baseR

    const sizeL = Math.max(minSizePx, Math.min(baseL + delta, total - minSizePx))
    const sizeR = total - sizeL
    const basisL = (sizeL / measured) * 100
    const basisR = (sizeR / measured) * 100
    dragElemL.style.flex = `0 0 ${basisL}%`
    dragElemR.style.flex = `0 0 ${basisR}%`
  }

  function measurePanes(): number {
    if (!container) {
      return 0
    }
    let total = 0
    for (let i = 0; i < container.children.length; i++) {
      const el = container.children[i] as HTMLElement
      const rect = el.getBoundingClientRect()
      const size = isHorizontal ? rect.width : rect.height
      total += size
      if (!el.classList.contains('fluid')) {
        el.style.flex = `0 0 ${size}px`
      } else {
        el.style.flex = `1`
      }
    }
    return total
  }

  function tearDown() {
    const parent = dragElemL?.parentElement as HTMLElement
    if (parent) {
      parent.classList.remove('dragging')
    }
    dragElemL = null
    dragElemR = null
    startBoxL = null
    startBoxR = null
    startEvent = null
    measured = null
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', tearDown)
    measurePanes()
  }

  return {
    oncreate: ({ dom }) => {
      container = dom as HTMLElement
    },
    view: ({ attrs: { style, flow, minSize, ...rest }, children }) => {
      isHorizontal = flow === 'row'
      minSizePx = minSize = Math.max(minSize || 16, 0)
      queueMicrotask(measurePanes)
      return m(
        'div.twui-split-pane',
        {
          ...rest,
          class: uiClass({
            'twui-split-pane-h': isHorizontal,
            'twui-split-pane-v': !isHorizontal,
          }),
          style: {
            ...(style || {}),
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
          },
        },
        mapChildren(children, (child, i, list) => {
          if (!child) {
            return null
          }
          const noGutter = !list[i + 1]
          return [
            child,
            noGutter
              ? null
              : m('div.twui-split-gutter', {
                  class: uiClass({
                    'twui-split-gutter-h': isHorizontal,
                    'twui-split-gutter-v': !isHorizontal,
                  }),
                  onmousedown: (e: MouseEvent) =>
                    handleMouseDown(e, i, child as any, list[i + 1] as any),
                }),
          ]
        }),
      )
    },
  }
}
