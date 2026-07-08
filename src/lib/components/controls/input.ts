import m, { Child, Children, Vnode } from 'mithril'
import { getControlValue, setControlValue } from '../../core'
import { uiWidget, ValueWidgetAttrs } from '../elements'

/**
 * Basic input component model
 * @public
 */
export type InputWidgetAttrs<T = unknown> = ValueWidgetAttrs<T, string> & {
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
   *
   */
  type?: string
}

export function uiInputWidget<T>(
  attrs: InputWidgetAttrs<T>,
  children?: Children,
): Vnode<InputWidgetAttrs<T>> {
  return m(InputWidgetComponent<T>, attrs, children)
}

export function uiInput<T>(
  attrs: InputWidgetAttrs<T>,
  children?: Children,
): Vnode<InputWidgetAttrs<T>> {
  return m(InputComponent<T>, attrs, children)
}

export const InputWidgetComponent = <T>(): m.Component<InputWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-input-widget`,
          label: label ?? (rest.field as any),
          class: className,
        },
        m(InputComponent<T>, rest),
      )
    },
  }
}

export const InputComponent = <T>(): m.Component<InputWidgetAttrs<T>> => {
  let attrs: InputWidgetAttrs<T>
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
      return m('div.twk-input', {}, [
        node.attrs.slotBefore ? m('span', {}, node.attrs.slotBefore) : null,
        m('input', {
          type: attrs.type || 'text',
          value: getControlValue(attrs),
          oninput: onchange,
          onchange: onchange,
          placeholder: attrs.placeholder,
          disabled: attrs.readonly,
        }),
        node.attrs.slotAfter ? m('span', {}, node.attrs.slotAfter) : null,
      ])
    },
  }
}
