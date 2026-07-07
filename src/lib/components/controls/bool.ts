import m, { Child, Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, setControlValue, TweakableAttrs } from '../../core'
import { uiClass } from '../../core/utils'
import { CommonWidgetAttrs, uiWidget } from '../elements'

export type BooleanWidgetAttrs<T = unknown> = CommonWidgetAttrs & BooleanInputAttrs<T>

/**
 * Describes a checkbox control
 * @public
 */
export type BooleanInputAttrs<T = unknown> = TweakableAttrs<T, boolean> & {
  /**
   * This is called when the control value changes
   */
  onchange?: (model: T, value: boolean) => void

  /**
   * This is called when the control value changes
   */
  oninput?: (model: T, value: boolean) => void

  /**
   * Content before the input field
   */
  slotBefore?: Child

  /**
   * Content after the input field
   */
  slotAfter?: Child

  /**
   * Content shown when the value is true
   */
  slotTrue?: Child

  /**
   * Content shown when the value is false
   */
  slotFalse?: Child

  /**
   * Disables the control input
   */
  readonly?: boolean

  /**
   * Whether to use a toggle button style instead of a checkbox. By default, this is false (checkbox style).
   */
  toggle?: boolean

  /**
   * Aligns the checkbox to the start or end of the control.
   * By default, the checkbox is placed at the end of the control.
   */
  align?: 'start' | 'end'
}

export function uiBoolWidget<T>(
  attrs: BooleanWidgetAttrs<T>,
  children?: Children,
): Vnode<BooleanWidgetAttrs<T>> {
  return m(BoolWidgetComponent as any, attrs as any, children)
}

export function uiBoolInput<T>(
  attrs: BooleanInputAttrs<T>,
  children?: Children,
): Vnode<BooleanInputAttrs<T>> {
  return m(BoolInputComponent as any, attrs as any, children)
}

export const BoolWidgetComponent: FactoryComponent<BooleanWidgetAttrs> = () => {
  return {
    view: ({ attrs: { tagName, label, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName}.twk-bool-widget`,
          label: label ?? rest.field,
          class: className,
        },
        [m(BoolInputComponent, rest)],
      )
    },
  }
}

export const BoolInputComponent: FactoryComponent<BooleanInputAttrs> = () => {
  let attrs: BooleanInputAttrs

  function onchange(e: Event) {
    const value = (e.target as HTMLInputElement).checked
    setControlValue(attrs, value)
    attrs.oninput?.(attrs.value, value)
    attrs.onchange?.(attrs.value, value)
  }

  return {
    view: (node) => {
      attrs = node.attrs
      const checked = getControlValue(attrs) === true
      const alignEnd = attrs.align === 'end'
      return m(
        'div.twk-bool-input',
        {
          class: uiClass({
            'twk-align-start': !alignEnd,
            'twk-align-end': !!alignEnd,
            'twk-bool-true': checked,
            'twk-bool-false': !checked,
          }),
        },
        [
          attrs.slotBefore,
          attrs.readonly
            ? checked
              ? attrs.slotTrue || m('span', 'true')
              : attrs.slotFalse || m('span', 'false')
            : m('input', {
                class: uiClass({
                  'twk-toggle': !!attrs.toggle,
                  'twk-check': !attrs.toggle,
                }),
                type: 'checkbox',
                checked: checked,
                onchange: onchange,
              }),

          attrs.slotAfter,
          node.children,
        ],
      )
    },
  }
}
