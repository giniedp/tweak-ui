/**
 * Tests run in a real Chromium instance (via Playwright), so DOM APIs like
 * ResizeObserver, focus/blur and dialog semantics behave natively - no
 * jsdom-style polyfills are needed here.
 *
 * Elements still aren't laid out with the library's real CSS (specs import
 * component modules directly, not `style.scss`), so a bare `<div>` mounted
 * by the test harness typically has a zero-size `getBoundingClientRect()`.
 * Drag/pointer-math tests that need specific dimensions can stub it, e.g.:
 *
 *   stubRect(el, { width: 100, height: 20, left: 10, top: 5 })
 */
export function stubRect(el: Element, rect: Partial<DOMRect>): void {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    toJSON() {},
    ...rect,
  } as DOMRect)
}

/**
 * The Playwright-driven browser instance isn't configured with touch
 * emulation (`hasTouch`), so real `Touch`/`TouchEvent` objects aren't
 * available. Source code only ever reads `'touches' in e` and
 * `e.touches.item(0).pageX/pageY`, so build a plain object shaped like one
 * instead, e.g.:
 *
 *   el.dispatchEvent(Object.assign(new Event('touchmove'), fakeTouch(10, 20)))
 */
export function fakeTouch(pageX: number, pageY: number) {
  return {
    touches: {
      item: () => ({ pageX, pageY }),
    },
  }
}
