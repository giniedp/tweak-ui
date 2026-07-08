import m, { Children, Vnode } from 'mithril'
import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { uiClass } from '../../core/utils'
import { CommonWidgetAttrs, uiButton, uiWidget } from '../elements'

/**
 * @public
 */
export type BitmaskWidgetAttrs<T = unknown> = CommonWidgetAttrs & BitmaskInputAttrs<T>

/**
 * Bitmask component model
 * @public
 */
export type BitmaskInputAttrs<T = unknown> = TweakableAttrs<T, number> & {
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

  /**
   * The number of bits in the mask
   */
  bitCount?: number

  /**
   * Maaping of names to bit values. If provided, the control will display the names instead of the bit indices.
   */
  names?: Record<string, number>
}

export function uiBitmaskWidget<T>(
  attrs: BitmaskWidgetAttrs<T>,
  children?: Children,
): Vnode<BitmaskWidgetAttrs<T>> {
  return m(BitmaskWidgetComponent<T>, attrs, children)
}

export const BitmaskWidgetComponent = <T>(): m.Component<BitmaskWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-Bitmask-widget`,
          label: label ?? (rest.field as any),
          class: className,
        },
        [m(BitmaskInputComponent<T>, rest)],
      )
    },
  }
}

export function uiBitmaskInput<T>(
  attrs: BitmaskInputAttrs<T>,
  children?: Children,
): Vnode<BitmaskInputAttrs<T>> {
  return m(BitmaskInputComponent<T>, attrs, children)
}

export const BitmaskInputComponent = <T>(): m.Component<BitmaskInputAttrs<T>> => {
  let attrs: BitmaskInputAttrs<T>

  function getBitCount() {
    return attrs.bitCount || 32
  }

  function toggleBit(index: number) {
    let value = getControlValue(attrs)
    value = value ^ (1 << index)
    emitChange(value)
  }

  function setAllBits() {
    const bitCount = getBitCount()
    let value = getControlValue(attrs)
    for (let i = 0; i < bitCount; i++) {
      value = value | (1 << i)
    }
    emitChange(value)
  }

  function clearAllBits() {
    const bitCount = getBitCount()
    let value = getControlValue(attrs)
    for (let i = 0; i < bitCount; i++) {
      value = value & ~(1 << i)
    }
    emitChange(value)
  }

  function emitChange(value: number) {
    setControlValue(attrs, value)
    attrs.oninput?.(attrs.value, value)
    attrs.onchange?.(attrs.value, value)
  }

  function isBitSet(value: number, index: number) {
    return (value & (1 << index)) !== 0
  }

  function bitName(index: number) {
    if (attrs.names) {
      for (const [name, value] of Object.entries(attrs.names)) {
        if (value === 1 << index) {
          return name
        }
      }
    }
    return null
  }

  return {
    view: (node) => {
      attrs = node.attrs
      const bitCount = getBitCount()
      const value = getControlValue(attrs)
      return m(
        'div.twk-bitmask-input',
        {},
        Array.from({ length: bitCount }, (_, i) => {
          return m(
            'label.twk-bitmask-row',
            {
              tabindex: 0,
              class: uiClass({
                'twk-bitmask-active': isBitSet(value, i),
              }),
              onclick: () => toggleBit(i),
            },
            [
              m('div.twk-bitmask-indicator', {}),
              m('div.twk-bitmask-name', {}, bitName(i) || ''),
              m('div.twk-bitmask-bit', {}, `bit ${i}`),
              m(
                'div.twk-bitmask-value',
                {},
                '0x' + String(Math.pow(2, i).toString(16)).padStart(Math.ceil(bitCount / 4), '0'),
              ),
            ],
          )
        }),
      )
    },
  }
}
