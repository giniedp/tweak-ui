import m, { Children, Vnode } from 'mithril'
import { ControlAdapter, getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { call, dragUtil, getTouchInTarget, uiClass } from '../../core/utils'
import { CommonWidgetAttrs, uiWidget } from '../elements'
import { uiScalarInput } from './scalar'

export type AngleWidgetAttrs<T = unknown> = CommonWidgetAttrs & AngleInputAttrs<T>

/**
 * Spherical component model
 * @public
 */
export type AngleInputAttrs<T = unknown> = TweakableAttrs<T, number> & {
  /**
   * Whether to use degrees instead of radians
   */
  degree?: boolean

  /**
   * The min value in degrees
   */
  min?: number

  /**
   * The max value in degrees
   */
  max?: number

  /**
   * The step value in degrees
   */
  step?: number

  /**
   * Disables the control input
   */
  readonly?: boolean

  /**
   * This is called when the control value has been changed.
   */
  oninput?: (target: T, value: number) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (target: T, value: number) => void
}

export function uiAngleWidget<T>(
  attrs: AngleWidgetAttrs<T>,
  children?: Children,
): Vnode<AngleWidgetAttrs<T>> {
  return m(AngleWidgetComponent<T>, attrs, children)
}

export function uiAngleInput<T>(
  attrs: AngleInputAttrs<T>,
  children?: Children,
): Vnode<AngleInputAttrs<T>> {
  return m(AngleInputComponent<T>, attrs, children)
}

export const AngleWidgetComponent = <T>(): m.Component<AngleWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-angle-widget`,
          label: label ?? (rest.field as any),
          class: className,
        },
        [m(AngleInputComponent<T>, rest)],
      )
    },
  }
}

const RAD_TO_DEG = 180 / Math.PI
const DEG_TO_RAD = Math.PI / 180

export const radToDegAdapter: ControlAdapter<number, number> = {
  toControl: (value: number) => value * RAD_TO_DEG,
  fromControl: (value: number) => value * DEG_TO_RAD,
}

export const degToRadAdapter: ControlAdapter<number, number> = {
  toControl: (value: number) => value * DEG_TO_RAD,
  fromControl: (value: number) => value * RAD_TO_DEG,
}

export const AngleInputComponent = <T>(): m.Component<AngleInputAttrs<T>> => {
  let angle = 0 // in radians
  let dragging = false
  let pos = [0, 0]
  let paneElement: HTMLElement
  let min: number
  let max: number
  let step: number | undefined
  let attrs: AngleInputAttrs<T>

  function clampAndSnapAngle(angle: number) {
    if (min != null && max != null) {
      if (min <= max) {
        if (angle < min) {
          angle = min
        } else if (angle > max) {
          angle = max
        }
      } else if (!(angle >= min || angle <= max)) {
        const dMin = Math.abs(angle - min)
        const dMax = Math.abs(angle - max)
        angle = dMin < dMax ? min : max
      }
    } else if (min != null) {
      if (angle < min) {
        angle = min
      }
    } else if (max != null) {
      if (angle > max) {
        angle = max
      }
    }

    if (step != null) {
      angle = Math.round(angle / step) * step
    }
    return angle
  }

  function wrapDegrees(angle: number) {
    angle = angle % 360
    if (angle < 0) {
      angle += 360
    }
    return angle
  }

  function updateState(node: Vnode<AngleInputAttrs<T>>) {
    attrs = node.attrs

    min = attrs.min!
    max = attrs.max!
    step = attrs.step!
    min = min != null ? wrapDegrees(min) * DEG_TO_RAD : null!
    max = max != null ? wrapDegrees(max) * DEG_TO_RAD : null!
    step = step != null ? wrapDegrees(step) * DEG_TO_RAD : null!
    angle = getControlValue(attrs) ?? angle
    if (attrs.degree) {
      angle = angle * DEG_TO_RAD
    }
    updatePositions()
  }

  function onEvent(type: 'change' | 'input') {
    updatePositions()
    const value = attrs.degree ? angle * RAD_TO_DEG : angle
    setControlValue(attrs, value)
    call(type === 'input' ? attrs.oninput : attrs.onchange, attrs.value, value)
  }

  function updatePositions() {
    pos[0] = Math.cos(angle)
    pos[1] = Math.sin(angle)
  }

  function onDragStart(e: MouseEvent) {
    dragging = true
    drag.activate(e)
  }

  let touchOffset: [number, number]
  const drag = dragUtil({
    onStart: (e) => {
      const touch = getTouchInTarget(e)
      touchOffset = [-(touch.x - touch.width / 2), -(touch.y - touch.height / 2)]
    },
    onMove: (e) => {
      e.preventDefault()
      const position = getTouchInTarget(e, paneElement, touchOffset)
      const px = position.normalizedX - 0.5
      const py = position.normalizedY - 0.5
      if (dragging) {
        angle = Math.atan2(px, -py)

        // ensure angle is always positive for better UX
        if (angle < 0) {
          angle += 2 * Math.PI
        }
      }
      angle = clampAndSnapAngle(angle)
      onEvent('input')
      m.redraw()
    },
    onEnd: () => {
      drag.deactivate()
      dragging = false
      onEvent('change')
      m.redraw()
    },
  })

  function wrapAngle(angle: number) {
    if (angle < 0) {
      angle += 360
    }
    return angle % 360
  }

  return {
    onremove: () => {
      drag.deactivate()
    },
    oninit: (node) => {
      updateState(node)
    },
    onupdate: (node) => {
      updateState(node)
    },
    view: ({ attrs: { ...rest } }: Vnode<AngleInputAttrs<T>>) => {
      return m(
        'div.twk-angle-input',
        {
          style: {
            '--angle-value': `${wrapAngle(angle * RAD_TO_DEG)}`,
          },
        },
        [
          uiScalarInput({
            unit: attrs.degree ? '°' : 'rad',
            range: true,
            ...rest,
            slotAfter: m('span.twk-flex-row', [
              m('span.twk-color-dim', '/'),
              (attrs.degree ? angle : angle * RAD_TO_DEG).toFixed(1),
              m('span.twk-color-dim', attrs.degree ? 'rad' : '°'),
            ]),
          }),

          m('div.twk-angle-pane', {
            oncreate: (vnode) => (paneElement = vnode.dom as HTMLElement),
            // onmousedown: onDragStart,
            // ontouchstart: onDragStart,
            class: uiClass({
              'is-dragging': dragging,
            }),
            style: {
              aspectRatio: '1',
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              position: 'relative',
            },
          }),
        ],
      )
    },
  }
}
