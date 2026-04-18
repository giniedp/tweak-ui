import m, { Children, FactoryComponent, Vnode } from 'mithril'

import { ControlValue, getControlValue, setControlValue } from '../../core'
import { call, clamp, dragUtil, getTouchInTarget, twuiClass } from '../../core/utils'
import { ControlAttrs, ControlComponent } from './control'

/**
 * Number component model
 * @public
 */
export interface NumberAttrs<T = unknown> extends ControlValue<T, number>, ControlAttrs {
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
  onInput?: (model: T, value: number) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: T, value: number) => void

  /**
   * Disables the control input
   */
  disabled?: boolean
}

export function uiNumber<T>(attrs: NumberAttrs<T>, children?: Children): Vnode<NumberAttrs<T>> {
  return m(NumberComponent as any, attrs as any, children)
}

export const NumberComponent: FactoryComponent<NumberAttrs> = () => {
  let type: 'number' | 'slider'
  let min: number
  let max: number
  let step: number | undefined
  let disabled: boolean
  let placeholder: string
  let isSlider: boolean
  let value: number
  let percent: number
  let attrs: NumberAttrs

  function updateState(node: m.Vnode<NumberAttrs>) {
    attrs = node.attrs
    isSlider = !!attrs.slider
    type = isSlider ? 'slider' : 'number'
    min = isSlider ? (attrs.min ?? 0) : attrs.min!
    max = isSlider ? (attrs.max ?? 1) : attrs.max!
    step = isSlider ? (attrs.step ?? 0.01) : attrs.step!
    value = getControlValue<number>(attrs)
    disabled = !!attrs.disabled
    percent = isSlider ? ((value - min) / (max - min)) * 100 : 0

    console.log('updateState', { value, percent, min, max, isSlider, attrs })
  }

  function setModelValue(e: 'input' | 'change', v: number) {
    value = isNaN(v) ? null! : clamp(v, min, max)!
    setControlValue(attrs, value)
    const cb = e === 'input' ? attrs.onInput : attrs.onChange
    call(cb, attrs.value, value)
    m.redraw()
  }

  function onInput(e: Event) {
    const el = e.target as HTMLInputElement
    setModelValue('input', parseFloat(el.value))
  }

  function onChange(e: Event) {
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

  function onWheel(e: WheelEvent) {
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
      return m(
        ControlComponent,
        {
          label: attrs.label,
          description: attrs.description,
          style: attrs.style,
          class: twuiClass('number'),
        },
        m.fragment({}, [
          isSlider
            ? m("input[type='range']", {
                ariahidden: true,
                min: min,
                max: max,
                step: step,
                value: value,
                oninput: onInput,
                onchange: onChange,
                onwheel: onWheel,
                disabled: disabled,
              })
            : null,
          m("input[type='number']", {
            min: min,
            max: max,
            step: step,
            value: value,
            oninput: onInput,
            onchange: onChange,
            onwheel: onWheel,
            placeholder: placeholder!,
            disabled: disabled,
          }),
        ]),
      )
    },
  }
}
