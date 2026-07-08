import m, { Children, Vnode } from 'mithril'

import { getControlValue, TweakableAttrs } from '../../core'
import { call, clamp, dragUtil, getTouchPoint, uiClass } from '../../core/utils'
import { CommonWidgetAttrs, uiWidget } from '../elements'

export type PointWidgetAttrs<T = unknown> = CommonWidgetAttrs & PointInputAttrs<T>

/**
 * Point component model
 * @public
 */
export type PointInputAttrs<T = unknown> = TweakableAttrs<T, any> & {
  /**
   * The object field names. Defaults to `['x', 'y']`
   */
  keys?: string[]

  /**
   * X-Axis min and max valuse
   */
  rangeX?: [number, number]

  /**
   * Y-Axis min and max valuse
   */
  rangeY?: [number, number]

  /**
   * Value to reset to when released
   */
  reset?: [number, number]

  /**
   * Snap to grid value
   */
  snap?: number

  /**
   * This is called when the control value has been changed.
   */
  oninput?: (model: PointInputAttrs<T>, value: number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: PointInputAttrs<T>, value: number) => void
}

const DEFAULT_RANGE = [0, 1]
const DEFAULT_KEYS = ['x', 'y']

export function uiPointWidget<T>(
  attrs: PointWidgetAttrs<T>,
  children?: Children,
): Vnode<PointWidgetAttrs<T>> {
  return m(PointWidgetComponent<T>, attrs, children)
}

export function uiPoint<T>(
  attrs: PointWidgetAttrs<T>,
  children?: Children,
): Vnode<PointWidgetAttrs<T>> {
  return m(PointWidgetComponent<T>, attrs, children)
}

export function uiPointInput<T>(
  attrs: PointInputAttrs<T>,
  children?: Children,
): Vnode<PointInputAttrs<T>> {
  return m(PointInputComponent<T>, attrs, children)
}

export const PointWidgetComponent = <T>(): m.Component<PointWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-point-widget`,
          label: label ?? (rest.field as any),
          class: uiClass('twk-point', className),
        },
        [m(PointInputComponent<T>, rest)],
      )
    },
  }
}

export const PointInputComponent = <T>(): m.Component<PointInputAttrs<T>> => {
  let kx: any
  let ky: any
  let xRange = DEFAULT_RANGE
  let yRange = DEFAULT_RANGE
  let vx = 0
  let vy = 0
  let x = 0
  let y = 0
  let rx: number
  let ry: number
  let snap: number
  let attrs: PointInputAttrs<T>

  function updateState(node: m.Vnode<PointInputAttrs<T>>) {
    attrs = node.attrs
    const keys = attrs.keys || DEFAULT_KEYS
    kx = keys[0]
    ky = keys[1]
    const value: any = getControlValue(attrs) ?? {
      [kx]: vx,
      [ky]: vy,
    }
    snap = attrs.snap!
    vx = value[kx] || 0
    vy = value[ky] || 0
    xRange = attrs.rangeX || xRange
    yRange = attrs.rangeY || yRange
    x = (vx - xRange[0]) / (xRange[1] - xRange[0])
    y = (vy - yRange[0]) / (yRange[1] - yRange[0])
    const reset = attrs.reset
    if (reset) {
      rx = (reset[0] - xRange[0]) / (xRange[1] - xRange[0])
      ry = (reset[1] - yRange[0]) / (yRange[1] - yRange[0])
    }
  }

  function updateValue() {
    vx = xRange[0] + (xRange[1] - xRange[0]) * x
    vy = yRange[0] + (yRange[1] - yRange[0]) * y
    if (snap > 0) {
      vx = Math.floor(vx / snap) * snap
      vy = Math.floor(vy / snap) * snap
      x = (vx - xRange[0]) / (xRange[1] - xRange[0])
      y = (vy - yRange[0]) / (yRange[1] - yRange[0])
    }
  }

  function onchange(type: 'change' | 'input') {
    updateValue()
    const value: any = getControlValue(attrs) ?? {
      [kx]: vx,
      [ky]: vy,
    }
    value[kx] = vx
    value[ky] = vy
    call(type === 'input' ? attrs.oninput : attrs.onchange, attrs, value)
  }

  function onMouseDown(e: MouseEvent) {
    drag.activate(e)
  }

  const drag = dragUtil({
    onMove: (e) => {
      e.preventDefault()
      const target = drag.target!
      const rect = target.getBoundingClientRect()
      const tx = window.pageXOffset || document.documentElement.scrollLeft
      const ty = window.pageYOffset || document.documentElement.scrollTop

      const cw = target.clientWidth
      const ch = target.clientHeight
      let [cx, cy] = getTouchPoint(e)
      x = clamp((cx - tx - rect.left) / cw, 0, 1)
      y = clamp((cy - ty - rect.top) / ch, 0, 1)

      onchange('input')
      m.redraw()
    },
    onEnd: () => {
      drag.deactivate()
      if (rx != null && ry != null) {
        x = rx
        y = ry
        onchange('input')
      }
      onchange('change')
      m.redraw()
    },
  })

  return {
    onremove: drag.deactivate,
    oninit: updateState,
    onupdate: updateState,
    view: (node) => {
      updateState(node)
      return m(
        '.point-area',
        {
          tabindex: 0,
          onmousedown: onMouseDown,
          ontouchstart: onMouseDown,
        },
        m('.point-x-axis', {
          style: {
            'pointer-events': 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${y * 100}%`,
            height: `1px`,
          },
        }),
        m('.point-y-axis', {
          style: {
            'pointer-events': 'none',
            position: 'absolute',
            left: `${x * 100}%`,
            top: 0,
            bottom: 0,
            width: `1px`,
          },
        }),
        m('.point-cursor', {
          style: {
            'pointer-events': 'none',
            left: `${x * 100}%`,
            top: `${y * 100}%`,
            position: 'absolute',
            width: '11px',
            height: '11px',
            'margin-top': '-5px',
            'margin-left': '-5px',
            border: '1px solid white',
            'border-radius': '5px',
            'box-shadow': '0px 0px 2px 1px rgba(0, 0, 0, 0.75)',
          },
        }),
      )
    },
  }
}
