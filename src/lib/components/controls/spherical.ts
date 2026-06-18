import m, { Children, FactoryComponent, Vnode } from 'mithril'

import { getControlValue, setControlValue } from '../../core'
import { call, clamp, dragUtil, getTouchInTarget, uiClass } from '../../core/utils'
import { uiControl, ValueControlAttrs } from '../elements'

/**
 * @public
 */
export type CartesianValue = { x: number; y: number; z: number }

/**
 * @internal
 */
export type SphericalValue = { radius: number; azimuth: number; polar: number }

/**
 * Spherical component model
 * @public
 */
export interface SphericalAttrs<T = unknown> extends ValueControlAttrs<T, CartesianValue> {
  /**
   * This is called when the control value has been changed.
   */
  oninput?: (model: T, value: unknown) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: T, value: unknown) => void
}

export function uiSpherical<T>(
  attrs: SphericalAttrs<T>,
  children?: Children,
): Vnode<SphericalAttrs<T>> {
  return m(SphericalComponent as any, attrs as any, children)
}

export const SphericalComponent: FactoryComponent<SphericalAttrs> = () => {
  let radius = 1
  let azimuth = 0 // [0, 2PI]
  let polar = 0 // [0,  PI]
  let backface = false
  let paneElement: HTMLElement

  let dragging: 'pol' | 'azi' | null = null
  let attrs: SphericalAttrs
  let cartesian: CartesianValue
  function read(): SphericalValue {
    return toSpherical(getControlValue(attrs) || toCartesian(radius, azimuth, polar))
  }

  function updateState(node: m.Vnode<SphericalAttrs>) {
    attrs = node.attrs
    const value = read()
    radius = value.radius ?? 1
    azimuth = value.azimuth ?? 0
    polar = value.polar ?? 0
    backface = polar > Math.PI / 2
  }

  function onchange(type: 'change' | 'input') {
    const value = toCartesian(radius, azimuth, polar)
    setControlValue(attrs, value)
    call(type === 'input' ? attrs.oninput : attrs.onchange, attrs.value, value)
  }

  function onStartPolar(e: MouseEvent) {
    dragging = 'pol'
    drag.activate(e)
    ;(e.target as HTMLElement).focus()
    return false
  }
  function onStartAzim(e: MouseEvent) {
    dragging = 'azi'
    drag.activate(e)
    ;(e.target as HTMLElement).focus()
    return false
  }

  const drag = dragUtil({
    onStart: (e) => {},
    onMove: (e) => {
      const position = getTouchInTarget(e, paneElement)
      const px = position.normalizedX - 0.5
      const py = position.normalizedY - 0.5
      if (dragging === 'azi') {
        // [-PI;PI]
        azimuth = Math.atan2(py, px)
        if (azimuth < 0) {
          azimuth += 2 * Math.PI
        }
      } else if (dragging === 'pol') {
        // closest point on segment
        // p0: [0, 0], p1: vPhi
        const ab = [Math.cos(azimuth), Math.sin(azimuth)]
        const ac = [px, py]
        const t = (ab[0] * ac[0] + ab[1] * ac[1]) / Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1])

        polar = Math.PI * clamp(t, 0, 0.5)
        if (backface) {
          polar = Math.PI - polar
        }
      }
      onchange('input')
      m.redraw()
    },
    onEnd: (e) => {
      drag.deactivate()
      dragging = null
      onchange('change')
      m.redraw()
    },
  })

  function onPhiInput(model: unknown, value: number) {
    azimuth = toRad(value)
    onchange('input')
  }
  function onPhiChange(model: unknown, value: number) {
    azimuth = toRad(value)
    onchange('change')
  }

  function onThetaInput(model: unknown, value: number) {
    polar = toRad(value)
    onchange('input')
  }
  function onThetaChange(model: unknown, value: number) {
    polar = toRad(value)
    onchange('change')
  }
  function onBackfaceChange(model: unknown, value: boolean) {
    backface = value
    polar = Math.PI - polar
    onchange('change')
    setTimeout(() => m.redraw())
  }

  return {
    onremove: () => {
      drag.deactivate()
    },
    oninit: updateState,
    onupdate: updateState,
    view: () => {
      cartesian = toCartesian(radius, azimuth, polar, cartesian)
      return uiControl(
        {
          tagName: 'label.twui-spherical',
          label: attrs.label,
          description: attrs.description,
          class: attrs.class,
          style: {
            '--azimuth-value': `${toDeg(azimuth)}`,
            '--polar-value': `${toDeg(polar)}`,
          },
        },
        [
          m(
            'div.twui-spherical-label',
            {},
            `x: ${cartesian.x.toFixed(2)} y: ${cartesian.y.toFixed(2)} z: ${cartesian.z.toFixed(2)}`,
          ),
          m(
            'div.twui-spherical-pane',
            {
              oncreate: (vnode) => (paneElement = vnode.dom as HTMLElement),
              class: uiClass({
                'is-dragging': !!dragging,
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
              'div.twui-spherical-arm',
              {
                onmousedown: onStartPolar,
                ontouchstart: onStartPolar,
                tabIndex: 0,
                style: {
                  width: '50%', // gives us the radius
                  display: 'flex',
                  justifyContent: 'end', // push knob to edge
                  alignItems: 'center',
                  transform: `translateX(50%) rotate(${azimuth}rad)`,
                  transformOrigin: 'left center',
                },
              },
              m('div.twui-spherical-knob', {
                onmousedown: onStartAzim,
                ontouchstart: onStartAzim,
                tabIndex: 0,
                style: {
                  aspectRatio: '1',
                  transform: 'translateX(100%)',
                },
              }),
            ),
          ),
        ],
      )
    },
  }
}

function toDeg(value: number) {
  return value * (180 / Math.PI)
}
function toRad(value: number) {
  return value * (Math.PI / 180)
}

/**
 *
 * @param value
 * @returns
 */
function toSpherical(value: Partial<CartesianValue>) {
  const x = value?.x ?? 0
  const y = value?.y ?? 0
  const z = value?.z ?? 0

  const radius = Math.sqrt(x * x + y * y + z * z) || 1

  const theta = Math.atan2(z, x) || 0 // rotation around Y
  const phi = Math.acos(y / radius) || 0 // angle from +Y

  return {
    radius,
    azimuth: theta,
    polar: phi,
  }
}

/**
 *
 * @param r - radius [0;inf]
 * @param theta - azimuth [0;2PI]
 * @param phi - polar [0;PI]
 * @returns
 */
function toCartesian(
  r: number,
  theta: number,
  phi: number,
  out?: Partial<CartesianValue>,
): CartesianValue {
  const sinPhi = Math.sin(phi)

  out = out || {}
  out.x = r * Math.cos(theta) * sinPhi
  out.y = r * Math.cos(phi)
  out.z = r * Math.sin(theta) * sinPhi

  return out as CartesianValue
}
