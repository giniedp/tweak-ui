import m from 'mithril'

/**
 * A component under test, mounted via `m.render()` so redraw timing is
 * fully synchronous and under the caller's control (unlike `m.mount()`,
 * which batches redraws via `requestAnimationFrame`).
 */
export interface Harness {
  /** The detached container element the component is rendered into. */
  el: HTMLElement
  mount: (component: m.Component) => void
  redraw: () => void
  /** Scoped `querySelector`, throws if nothing matches. */
  find<T extends Element = Element>(selector: string): T
  /** Scoped `querySelectorAll`. */
  findAll<T extends Element = Element>(selector: string): T[]
  /**
   * Dispatches a real DOM event on `target` (a selector or element) and
   * flushes a redraw afterwards. The redraw is necessary because the
   * component's own `m.redraw()` calls have nothing to repaint outside of
   * `m.mount()` - this harness's tree is only repainted by calling
   * `render()` again ourselves.
   */
  fire(target: Element | string, type: string, init?: EventInit | WheelEventInit): void
  /** Unmounts the component (runs `onbeforeremove`/`onremove`) and detaches the container. */
  unmount(): void
}

export function harness(): Harness {
  const el = document.createElement('div')
  document.body.appendChild(el)

  function mount(c: m.Component) {
    m.mount(el, c)
  }

  function find<T extends Element = Element>(selector: string): T {
    const found = el.querySelector<T>(selector)
    if (!found) {
      throw new Error(`mount(): no element matching "${selector}"`)
    }
    return found
  }

  return {
    el,
    mount,
    redraw: m.redraw,
    find,
    findAll<T extends Element = Element>(selector: string): T[] {
      return Array.from(el.querySelectorAll<T>(selector))
    },
    fire(target: Element | string, type: string, init?: EventInit) {
      const node = typeof target === 'string' ? find(target) : target
      const EventCtor = eventCtorFor(type)
      node.dispatchEvent(new EventCtor(type, { bubbles: true, cancelable: true, ...init }))
    },
    unmount() {
      m.render(el, null)
      el.remove()
    },
  }
}

function eventCtorFor(type: string): typeof Event {
  if (/^(click|dblclick|mouse|contextmenu)/i.test(type)) {
    return MouseEvent as unknown as typeof Event
  }
  if (/^key/i.test(type)) {
    return KeyboardEvent as unknown as typeof Event
  }
  if (/^(focus|blur)/i.test(type)) {
    return FocusEvent as unknown as typeof Event
  }
  if (/^wheel$/i.test(type)) {
    return WheelEvent as unknown as typeof Event
  }
  return Event
}
