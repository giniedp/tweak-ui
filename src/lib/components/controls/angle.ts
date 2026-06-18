import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue } from '../../core'
import { call, dragUtil, getTouchInTarget, uiClass } from '../../core/utils'
import { uiControl, ValueControlAttrs } from '../elements'

/**
 * Spherical component model
 * @public
 */
export interface AngleAttrs<T = unknown> extends ValueControlAttrs<T, number> {
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

export function uiAngle<T>(attrs: AngleAttrs<T>, children?: Children): Vnode<AngleAttrs<T>> {
  return m(AngleComponent as any, attrs as any, children)
}

export const AngleComponent: FactoryComponent<AngleAttrs> = () => {
  let angle = 0 // in radians
  let dragging = false
  let pos = [0, 0]
  let paneElement: HTMLElement
  let knobElement: HTMLElement
  let min: number
  let max: number
  let step: number | undefined
  let attrs: AngleAttrs

  const RAD_TO_DEG = 180 / Math.PI
  const DEG_TO_RAD = Math.PI / 180
  const TAU = 2 * Math.PI

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

  function updateState(node: Vnode<AngleAttrs>) {
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
    view: ({ attrs }: Vnode<AngleAttrs<any>>) => {
      return uiControl(
        {
          label: attrs.label,
          description: attrs.description,
          class: uiClass('twui-angle', attrs.class),
          style: {
            '--angle-value': `${angle * RAD_TO_DEG}`,
          },
        },
        [
          m(
            'div.twui-angle-label',
            {},
            `${(angle * RAD_TO_DEG).toFixed(1)}° / ${angle.toFixed(2)} rad`,
          ),
          m(
            'div.twui-angle-pane',
            {
              oncreate: (vnode) => (paneElement = vnode.dom as HTMLElement),
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
            },
            m(
              'div.twui-angle-arm',
              {
                style: {
                  width: '50%', // gives us the radius
                  display: 'flex',
                  justifyContent: 'flex-end', // push knob to edge
                  alignItems: 'center',
                  // offset -90deg to make 0° point up
                  transform: `translateX(50%) rotate(${angle - Math.PI / 2}rad)`,
                  transformOrigin: 'left center',
                },
              },
              m('div.twui-angle-knob', {
                oncreate: (vnode) => (knobElement = vnode.dom as HTMLElement),
                onmousedown: onDragStart,
                ontouchstart: onDragStart,
                tabIndex: 0,
                style: {
                  aspectRatio: '1',
                  transform: 'translateX(50%)',
                },
              }),
            ),
          ),
        ],
      )
    },
  }
}
