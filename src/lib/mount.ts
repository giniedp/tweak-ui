import m, { ChildArray, Component } from 'mithril'
import { Builder, BuilderFn } from './builder'
import { renderChildren } from './core'

/**
 * Mithril's hyperscript function.
 *
 * @public
 * @remarks
 * Useful to create custom components
 */
export const h = m

/**
 * Mounts a ui to the given element
 */
export function mountUi(target: Element | string, data: ChildArray): void
export function mountUi(target: Element | string, data: BuilderFn): void
export function mountUi<A, S>(target: Element | string, data: Component<A, S>): void
export function mountUi(target: Element | string, data: ChildArray | BuilderFn | Component): void {
  const el = typeof target === 'string' ? document.querySelector(target)! : target
  el.classList.add('tweak-ui')
  if (!data) {
    m.mount(el, null)
  } else if (Array.isArray(data)) {
    m.mount(el, { view: () => data })
  } else if (typeof data === 'function') {
    const schema = Builder.build(data)
    m.mount(el, {
      view: () => renderChildren(schema),
    })
  } else {
    m.mount(el, data)
  }
}

/**
 * Unmounts the ui from given host element
 *
 * @public
 * @param el - The ui host element
 */
export function unmountUi(target: Element | string) {
  const el = typeof target === 'string' ? document.querySelector(target)! : target
  m.mount(el, null)
}

/**
 * Redraws the ui
 *
 * @public
 * @remarks
 * When changing the ui description object qui callbacks (e.g. `onInput` or `onChange`)
 * the ui will redraw automatically.
 *
 * However if the ui description object is changed from outside the qui callback
 * then this method must be called in order to update the visual state.
 */
export function redrawUi() {
  m.redraw()
}
