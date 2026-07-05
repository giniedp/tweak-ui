import m, { Children, FactoryComponent, Vnode } from 'mithril'
import { getControlValue, TweakableAttrs } from '../../core'
import { CommonWidgetAttrs, uiWidget } from '../elements'

export type PollWidgetAttrs<T = unknown> = CommonWidgetAttrs & PollAttrs<T>

export type PollAttrs<T = unknown> = TweakableAttrs<T, string | number | boolean> & {
  interval?: number
}

export function uiPollWidget<T>(
  attrs: PollWidgetAttrs<T>,
  children?: Children,
): Vnode<PollWidgetAttrs<T>> {
  return m(PollWidgetComponent as any, attrs as any, children)
}

export function uiPoll<T>(attrs: PollAttrs<T>, children?: Children): Vnode<PollAttrs<T>> {
  return m(PollComponent as any, attrs as any, children)
}

export const PollWidgetComponent: FactoryComponent<PollWidgetAttrs> = () => {
  return {
    view: ({ attrs }) => {
      return uiWidget(
        {
          tagName: 'label.twk-input.twk-input-readonly',
          label: attrs.label ?? attrs.field,
          class: attrs.class,
        },
        m(PollComponent, attrs),
      )
    },
  }
}

export const PollComponent: FactoryComponent<PollWidgetAttrs> = () => {
  let el: HTMLElement
  let timer: number
  let attrs: PollAttrs

  return {
    oncreate({ dom }) {
      el = dom as HTMLElement
      timer = setInterval(() => {
        const value = getControlValue(attrs) ?? ''
        el.textContent = String(value)
      }, attrs.interval ?? 500)
    },

    onremove() {
      clearInterval(timer)
    },
    view: (node) => {
      attrs = node.attrs
      return m('div.twk-poll', {})
    },
  }
}
