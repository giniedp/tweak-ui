import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue } from '../../core'
import { uiClass } from '../../core/utils'
import { uiControl, ValueControlAttrs } from '../elements'
import { uiNumber } from './number'

/**
 * @public
 */
export type MatrixElements = number[]

/**
 * Matrix component model
 * @public
 */
export interface MatrixAttrs<T = unknown> extends ValueControlAttrs<T, MatrixElements> {
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
  disabled?: boolean
}

export function uiMatrix<T>(attrs: MatrixAttrs<T>, children?: Children): Vnode<MatrixAttrs<T>> {
  return m(MatrixComponent as any, attrs as any, children)
}

export const MatrixComponent: FactoryComponent<MatrixAttrs> = () => {
  let attrs: MatrixAttrs

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
      return uiControl(
        {
          label: attrs.label,
          description: attrs.description,
          class: uiClass('twui-matrix', attrs.class),
          contentStyle: {
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, auto)`,
          },
        },
        indices(rows, cols).map((field) => {
          return uiNumber({
            min: attrs.min,
            max: attrs.max,
            step: attrs.step,
            value: value?.[field],
            disabled: attrs.disabled,
            oninput: (_, v) => onchange('input', field, v as number),
            onchange: (_, v) => onchange('change', field, v as number),
          })
        }),
      )
    },
  }
}
