import m, { Children, FactoryComponent, Vnode } from 'mithril'

import { getControlValue, setControlValue } from '../../core'
import { clamp, dragUtil, getTouchInTarget } from '../../core/utils'
import { uiButton, uiControl, ValueControlAttrs } from '../elements'

/**
 * Number component model
 * @public
 */
export interface NumberAttrs<T = unknown> extends ValueControlAttrs<T, number> {
  /**
   * The placeholder text
   */
  placeholder?: string

  /**
   * Whether to use a slider input instead of a number input
   */
  slider?: boolean

  /**
   * The min value
   */
  min?: number

  /**
   * The max value
   */
  max?: number

  /**
   * The step value
   */
  step?: number

  /**
   * This is called when the control value has been changed.
   */
  oninput?: (model: T, value: number) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: T, value: number) => void

  /**
   * Disables the control input
   */
  disabled?: boolean

  /**
   * The maximum number of fraction digits to display. By default, this is 3.
   */
  maxFractionDigits?: number

  /**
   * The minimum number of fraction digits to display. By default, this is 0.
   */
  minFractionDigits?: number
}

export function uiNumber<T>(attrs: NumberAttrs<T>, children?: Children): Vnode<NumberAttrs<T>> {
  return m(NumberComponent as any, attrs as any, children)
}

export const NumberComponent: FactoryComponent<NumberAttrs> = () => {
  let min: number
  let max: number
  let step: number | undefined
  let disabled: boolean
  let placeholder: string
  let isSlider: boolean
  let value: number
  let attrs: NumberAttrs
  let editing: boolean

  function updateState(node: m.Vnode<NumberAttrs>) {
    attrs = node.attrs
    isSlider = !!attrs.slider
    min = isSlider ? (attrs.min ?? 0) : attrs.min!
    max = isSlider ? (attrs.max ?? 1) : attrs.max!
    step = isSlider ? (attrs.step ?? 0.01) : attrs.step!
    value = getControlValue<number>(attrs)
    disabled = !!attrs.disabled
  }

  function setModelValue(e: 'input' | 'change', v: number) {
    value = isNaN(v) ? null! : clamp(v, min, max)!
    setControlValue(attrs, value)
    const cb = e === 'input' ? attrs.oninput : attrs.onchange
    cb?.(attrs.value, value)
    m.redraw()
  }

  function onfocus() {
    editing = true
  }

  function onblur() {
    editing = false
  }

  function oninput(e: Event) {
    const el = e.target as HTMLInputElement
    setModelValue('input', parseFloat(el.value))
  }

  function onchange(e: Event) {
    const el = e.target as HTMLInputElement
    setModelValue('change', parseFloat(el.value))
  }

  function limit(v: number) {
    v = clamp(v, min, max)
    if (step != null) {
      v = Math.round(v / step) * step
    }
    return parseFloat(v.toFixed(5))
  }

  let drag = dragUtil({
    onStart: (e) => {
      drag.onMove?.(e)
    },
    onMove: (e) => {
      e.preventDefault()
      const s = getTouchInTarget(e, drag.target).normalizedX
      setModelValue('input', limit(min + s * (max - min)))
    },
    onEnd: () => {
      setModelValue('change', value)
      drag.deactivate()
    },
  })

  function onwheel(e: WheelEvent) {
    e.preventDefault()
    const dir = (e.ctrlKey ? 0.5 : 1) * clamp(e.deltaY, -1, 1)
    const add = (step || 0.2) * dir
    if (add) {
      setModelValue('change', limit((value || 0) - add))
    }
  }

  return {
    onremove: () => {
      drag.deactivate()
    },
    oninit: updateState,
    onupdate: updateState,
    view: (node) => {
      updateState(node)
      return uiControl(
        {
          tagName: 'label.twui-number',
          label: attrs.label,
          description: attrs.description,
          class: attrs.class,
        },
        [
          isSlider
            ? m("input[type='range']", {
                ariahidden: true,
                min: min,
                max: max,
                step: step,
                value: value,
                oninput: oninput,
                onchange: onchange,
                onwheel: onwheel,
                disabled: disabled,
              })
            : null,
          m('input', {
            type: editing ? 'number' : 'text',
            min: min,
            max: max,
            step: step,
            value: editing ? value : Intl.NumberFormat().format(value),
            onfocus: onfocus,
            onblur: onblur,
            oninput: oninput,
            onchange: onchange,
            onwheel: onwheel,
            placeholder: placeholder!,
            disabled: disabled,
          }),
        ],
      )
    },
  }
}
