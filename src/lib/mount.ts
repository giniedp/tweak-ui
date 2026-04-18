import m, { ChildArray } from 'mithril'
import { Builder, BuilderFn } from './builder'
import { GroupComponent } from './components'
import { renderSchema } from './core'

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
export function mountUi(target: Element | string, data: ChildArray | BuilderFn) {
  const el = typeof target === 'string' ? document.querySelector(target)! : target
  el.classList.add('twui-root')
  if (!data) {
    m.mount(el, null)
  } else if (Array.isArray(data)) {
    m.mount(el, { view: () => m(GroupComponent, {}, data) })
  } else if (data) {
    const schema = Builder.build(data)
    m.mount(el, {
      view: () => {
        return m(GroupComponent, {}, renderSchema(schema))
      },
    })
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
