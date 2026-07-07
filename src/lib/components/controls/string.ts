import m, { Child, Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { uiClass } from '../../core/utils'
import { CommonWidgetAttrs, uiWidget } from '../elements'

export type StringWidgetAttrs<T = unknown> = CommonWidgetAttrs & StringInputAttrs<T>

/**
 * Text component model
 * @public
 */
export type StringInputAttrs<T = unknown> = TweakableAttrs<T, string> & {
  /**
   * The placeholder text
   */
  placeholder?: string

  /**
   *
   */
  slotStart?: Child

  /**
   *
   */
  slotEnd?: Child

  /**
   * This is called when the control value has been changed.
   */
  oninput?: (model: T, value: string) => void

  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onchange?: (model: T, value: string) => void

  /**
   * Disables the control input
   */
  readonly?: boolean

  /**
   * The number of rows for a textarea. If not specified, a single-line input will be used.
   */
  rows?: number
}

export function uiStringWidget<T>(
  attrs: StringWidgetAttrs<T>,
  children?: Children,
): Vnode<StringWidgetAttrs<T>> {
  return m(StringWidgetComponent as any, attrs as any, children)
}

export function uiString<T>(
  attrs: StringInputAttrs<T>,
  children?: Children,
): Vnode<StringInputAttrs<T>> {
  return m(StringInputComponent as any, attrs as any, children)
}

export const StringWidgetComponent: FactoryComponent<StringWidgetAttrs> = () => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-string-widget`,
          label: label ?? rest.field,
          class: className,
        },
        [m(StringInputComponent, rest)],
      )
    },
  }
}
export const StringInputComponent: FactoryComponent<StringInputAttrs> = () => {
  let attrs: StringInputAttrs
  function onchange(e: Event) {
    const el = e.target as HTMLInputElement
    const value = el.value
    setControlValue(attrs, value)
    const cb = e.type === 'input' ? attrs.oninput : attrs.onchange
    cb?.(attrs.value, value)
  }

  return {
    view: (node) => {
      attrs = node.attrs
      const editable = !attrs.readonly
      const value = getControlValue(attrs)
      return m(
        'div.twk-input.twk-string-input',
        {
          class: uiClass({
            'twk-input-readonly': !!attrs.readonly,
          }),
        },
        [
          attrs.slotStart ?? null,
          editable ? null : m('div.twk-input-value', value),
          !editable
            ? null
            : m(attrs.rows ? 'textarea' : "input[type='text']", {
                value: value,
                oninput: onchange,
                onchange: onchange,
                placeholder: attrs.placeholder,
                disabled: attrs.readonly,
                rows: attrs.rows,
              }),

          attrs.slotEnd ?? null,
        ],
      )
    },
  }
}
