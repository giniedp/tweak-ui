import m, { Child, Children, FactoryComponent, Vnode } from 'mithril'

import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { clamp, dragUtil, getTouchInTarget, uiClass } from '../../core/utils'
import { CommonWidgetAttrs, uiWidget } from '../elements'

export type ScalarWidgetAttrs<T = unknown> = CommonWidgetAttrs & ScalarInputAttrs<T>

/**
 * Scalar component model
 * @public
 */
export type ScalarInputAttrs<T = unknown> = TweakableAttrs<T, number> & {
  /**
   * The placeholder text
   */
  placeholder?: string

  /**
   * Content before the input field
   */
  slotBefore?: Child

  /**
   * Content after the input field
   */
  slotAfter?: Child

  /**
   * The unit to display after the value. For example, "px" or "kg".
   */
  unit?: string

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
   * Displays a range slider below the input field. By default, this is false.
   */
  range?: boolean

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
  readonly?: boolean

  /**
   * The minimum number of fraction digits to display. By default, this is 1.
   */
  decimals?: number

  class?: string
}

export function uiScalarWidget<T>(
  attrs: ScalarWidgetAttrs<T>,
  children?: Children,
): Vnode<ScalarWidgetAttrs<T>> {
  return m(ScalarWidgetComponent as any, attrs as any, children)
}

export function uiScalarInput<T>(
  attrs: ScalarInputAttrs<T>,
  children?: Children,
): Vnode<ScalarInputAttrs<T>> {
  return m(ScalarInputComponent as any, attrs as any, children)
}

export const ScalarWidgetComponent: FactoryComponent<ScalarWidgetAttrs> = () => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-scalar-widget`,
          label: label ?? rest.field,
          class: className,
        },
        [m(ScalarInputComponent, rest)],
      )
    },
  }
}

export const ScalarInputComponent: FactoryComponent<ScalarInputAttrs> = () => {
  let min: number
  let max: number
  let step: number | undefined
  let readonly: boolean
  let placeholder: string
  let value: number
  let attrs: ScalarInputAttrs
  let editing: boolean
  let hasMinMax = false
  let hasStep = false
  let canDrag = false
  let range = false
  let formatter: Intl.NumberFormat | undefined

  function updateState(node: m.Vnode<ScalarInputAttrs>) {
    if (!formatter || node.attrs.decimals !== attrs.decimals) {
      formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: node.attrs.decimals ?? 1,
        maximumFractionDigits: node.attrs.decimals ?? 1,
        useGrouping: false,
      })
    }

    attrs = node.attrs
    min = attrs.min!
    max = attrs.max!
    step = attrs.step!
    range = !!attrs.range
    value = getControlValue<number>(attrs)
    readonly = !!attrs.readonly
    hasMinMax = min != null && max != null
    hasStep = step != null
    canDrag = hasMinMax || hasStep
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

  function onDragStart(e: MouseEvent) {
    if (!canDrag || readonly) {
      return
    }
    drag.activate(e)
  }

  let dragStartValue: number
  let dragStartPos: number
  let drag = dragUtil({
    onStart: (e) => {
      dragStartValue = value
      dragStartPos = getTouchInTarget(e, drag.target).normalizedX
    },
    onMove: (e) => {
      e.preventDefault()
      drag.target?.blur()
      const d = dragStartPos - getTouchInTarget(e, drag.target).normalizedX
      let v = dragStartValue
      if (hasMinMax) {
        v -= d * (max - min)
      } else if (hasStep) {
        v -= Math.round(d * 100) * step!
      }
      setModelValue('input', limit(v))
    },
    onEnd: () => {
      setModelValue('change', value)
      drag.deactivate()
    },
  })

  function onwheel(e: WheelEvent) {
    if (!editing) {
      return
    }
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
    onbeforeupdate: updateState,
    view: (node) => {
      updateState(node)
      const scalar = hasMinMax ? (value - min) / (max - min) : NaN
      return m(
        'div.twk-input.twk-scalar-input',
        {
          style: hasMinMax ? `--twk-scalar-value: ${scalar}` : '',
          class: uiClass(
            {
              'twk-input-readonly': readonly,
              'twk-scalar-dragable': !readonly && (hasMinMax || hasStep),
              'twk-scalar-range': range,
            },
            node.attrs.class,
          ),
        },
        [
          node.attrs.slotBefore ? m('span', {}, node.attrs.slotBefore) : null,
          m('input', {
            type: editing ? 'number' : 'text',
            min: min,
            max: max,
            step: step,
            value: editing ? value : formatter!.format(value),
            onfocus: onfocus,
            onblur: onblur,
            oninput: oninput,
            onchange: onchange,
            onwheel: onwheel,
            onmousedown: onDragStart,
            ontouchstart: onDragStart,
            placeholder: placeholder!,
            disabled: readonly,
          }),
          node.attrs.unit ? m('span.twk-color-muted', {}, node.attrs.unit) : null,
          node.attrs.slotAfter ? m('span', {}, node.attrs.slotAfter) : null,
        ],
      )
    },
  }
}
