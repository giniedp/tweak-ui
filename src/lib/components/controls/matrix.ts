import m, { Children, Vnode } from 'mithril'
import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { CommonWidgetAttrs, uiWidget } from '../elements'
import { uiScalarInput } from './scalar'

/**
 * @public
 */
export type MatrixElements = number[]
export type MatrixWidgetAttrs<T = unknown> = CommonWidgetAttrs & MatrixInputAttrs<T>

/**
 * Matrix component model
 * @public
 */
export type MatrixInputAttrs<T = unknown> = TweakableAttrs<T, MatrixElements> & {
  /**
   * The number of rows in the matrix
   */
  rows: number
  /**
   * The number of columns in the matrix
   */
  cols: number
  /**
   * Whether the input values are ordered in row-major order. Default assumes column-major order.
   */
  rowMajor?: boolean
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
  oninput?: (model: T, value: unknown) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: T, value: unknown) => void
  /**
   * Disables the control input
   */
  readonly?: boolean
}

export function uiMatrixWidget<T>(
  attrs: MatrixWidgetAttrs<T>,
  children?: Children,
): Vnode<MatrixWidgetAttrs<T>> {
  return m(MatrixWidgetComponent<T>, attrs, children)
}

export const MatrixWidgetComponent = <T>(): m.Component<MatrixWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || ''}.twk-matrix-widget`,
          label: label ?? (rest.field as any),
          class: className,
        },
        [m(MatrixInputComponent<T>, rest)],
      )
    },
  }
}
export function uiMatrixInput<T>(
  attrs: MatrixInputAttrs<T>,
  children?: Children,
): Vnode<MatrixInputAttrs<T>> {
  return m(MatrixInputComponent<T>, attrs, children)
}

export const MatrixInputComponent = <T>(): m.Component<MatrixInputAttrs<T>> => {
  let attrs: MatrixInputAttrs<T>

  function onchange(type: 'input' | 'change', field: number, v: number) {
    const value = getControlValue(attrs) || ({} as any)
    value[field] = v
    setControlValue(attrs, value)
    const cb = type === 'input' ? attrs.oninput : attrs.onchange
    cb?.(attrs.value, value)
  }

  function indices(rows: number, cols: number) {
    const result: number[] = []
    cols = attrs.rowMajor ? rows : cols
    rows = attrs.rowMajor ? cols : rows
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        result.push(r * cols + c)
      }
    }
    return result
  }

  return {
    view: (node) => {
      attrs = node.attrs
      const cols = attrs.cols ?? 1
      const rows = attrs.rows ?? 1
      const value = getControlValue(attrs)
      return m(
        'div.twk-matrix-input',
        {
          style: {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, auto)`,
          },
        },
        indices(rows, cols).map((field) => {
          return uiScalarInput({
            min: attrs.min,
            max: attrs.max,
            step: attrs.step,
            value,
            field,
            readonly: attrs.readonly,
            oninput: (_, v) => onchange('input', field, v as number),
            onchange: (_, v) => onchange('change', field, v as number),
          })
        }),
      )
    },
  }
}
