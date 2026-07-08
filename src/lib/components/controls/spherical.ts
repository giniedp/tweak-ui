import m, { Children, Vnode } from 'mithril'

import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { call, clamp, dragUtil, getTouchInTarget, uiClass } from '../../core/utils'
import { CommonWidgetAttrs, uiWidget } from '../elements'

/**
 * @public
 */
export type CartesianValue = { x: number; y: number; z: number }

/**
 * @internal
 */
export type SphericalValue = { radius: number; azimuth: number; polar: number }

export type SphericalWidgetAttrs<T = unknown> = CommonWidgetAttrs & SphericalInputAttrs<T>

/**
 * Spherical component model
 * @public
 */
export type SphericalInputAttrs<T = unknown> = TweakableAttrs<T, CartesianValue> & {
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

export function uiSphericalWidget<T>(
  attrs: SphericalWidgetAttrs<T>,
  children?: Children,
): Vnode<SphericalWidgetAttrs<T>> {
  return m(SphericalWidgetComponent<T>, attrs, children)
}

export function uiSpherical<T>(
  attrs: SphericalWidgetAttrs<T>,
  children?: Children,
): Vnode<SphericalWidgetAttrs<T>> {
  return m(SphericalWidgetComponent<T>, attrs, children)
}

export function uiSphericalInput<T>(
  attrs: SphericalInputAttrs<T>,
  children?: Children,
): Vnode<SphericalInputAttrs<T>> {
  return m(SphericalInputComponent<T>, attrs, children)
}

export const SphericalWidgetComponent = <T>(): m.Component<SphericalWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-spherical-widget`,
          label: label ?? (rest.field as any),
          class: className,
        },
        [m(SphericalInputComponent<T>, rest)],
      )
    },
  }
}

export const SphericalInputComponent = <T>(): m.Component<SphericalInputAttrs<T>> => {
  let radius = 1
  let azimuth = 0 // [0, 2PI]
  let polar = 0 // [0,  PI], 0 = front pole, PI/2 = equator, PI = back pole
  let paneElement: HTMLElement

  let dragging = false
  let attrs: SphericalInputAttrs<T>
  let cartesian: CartesianValue
  function read(): SphericalValue {
    return toSpherical(getControlValue(attrs) || toCartesian(radius, azimuth, polar))
  }

  // derived fresh from `polar` everywhere it's needed - `polar` can be mutated
  // directly (e.g. by onToggleBackface) between lifecycle hooks, so caching this
  // in a variable that's only refreshed by updateState() risks reading a stale
  // value the moment `view()` runs before the next onupdate.
  function isBackface() {
    return polar > Math.PI / 2
  }

  function updateState(node: m.Vnode<SphericalInputAttrs<T>>) {
    attrs = node.attrs
    const value = read()
    radius = value.radius ?? 1
    azimuth = value.azimuth ?? 0
    polar = value.polar ?? 0
  }

  function onchange(type: 'change' | 'input') {
    const value = toCartesian(radius, azimuth, polar)
    setControlValue(attrs, value)
    call(type === 'input' ? attrs.oninput : attrs.onchange, attrs.value, value)
  }

  // how far the knob sits from the pane center, as a fraction of the pane radius:
  // 0 = pole (front or back, depending on `hemisphereIsBack`), 1 = equator
  function reachOf(currentPolar: number, hemisphereIsBack: boolean) {
    return hemisphereIsBack ? (Math.PI - currentPolar) / (Math.PI / 2) : currentPolar / (Math.PI / 2)
  }

  function onPaneDown(e: MouseEvent) {
    dragging = true
    paneElement?.focus()
    drag.activate(e)
  }

  function onToggleBackface() {
    polar = Math.PI - polar
    onchange('change')
  }

  // the hemisphere being edited for the duration of one drag gesture; only the
  // explicit toggle (onToggleBackface) is allowed to switch hemispheres
  let dragBackface = false
  const drag = dragUtil({
    onStart: () => {
      dragBackface = isBackface()
    },
    onMove: (e) => {
      e.preventDefault()
      const position = getTouchInTarget(e, paneElement)
      const nx = (position.normalizedX - 0.5) * 2
      const ny = (position.normalizedY - 0.5) * 2
      const reach = clamp(Math.sqrt(nx * nx + ny * ny), 0, 1)
      azimuth = Math.atan2(ny, nx)
      polar = dragBackface ? Math.PI - reach * (Math.PI / 2) : reach * (Math.PI / 2)
      onchange('input')
      m.redraw()
    },
    onEnd: () => {
      drag.deactivate()
      dragging = false
      onchange('change')
      m.redraw()
    },
  })

  return {
    onremove: () => {
      drag.deactivate()
    },
    oninit: updateState,
    onupdate: updateState,
    view: () => {
      cartesian = toCartesian(radius, azimuth, polar, cartesian)
      const backface = isBackface()
      const reach = reachOf(polar, backface)
      const dx = Math.cos(azimuth) * reach
      const dy = Math.sin(azimuth) * reach
      return m('div.twk-spherical-input', {}, [
        m('div.twk-spherical-info', {}, [
          m('div.twk-spherical-label', {}, `x: ${cartesian.x.toFixed(2)}`),
          m('div.twk-spherical-label', {}, `y: ${cartesian.y.toFixed(2)}`),
          m('div.twk-spherical-label', {}, `z: ${cartesian.z.toFixed(2)}`),
          m("input.twk-toggle[type='checkbox']", {
            checked: backface,
            onchange: onToggleBackface,
            title: 'Edit the back side of the sphere',
          }),
        ]),
        m(
          'div.twk-spherical-pane',
          {
            oncreate: (vnode) => (paneElement = vnode.dom as HTMLElement),
            onmousedown: onPaneDown,
            ontouchstart: onPaneDown,
            tabIndex: 0,
            class: uiClass({
              'is-dragging': dragging,
            }),
          },
          [
            m('div.twk-spherical-arm', {
              style: {
                width: `${reach * 50}%`,
                transform: `rotate(${azimuth}rad)`,
              },
            }),
            m('div.twk-spherical-knob', {
              class: uiClass({ 'is-back': backface }),
              style: {
                left: `${50 + dx * 50}%`,
                top: `${50 + dy * 50}%`,
              },
            }),
          ],
        ),
      ])
    },
  }
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
