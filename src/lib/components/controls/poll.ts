import m, { Children, Vnode } from 'mithril'
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
  return m(PollWidgetComponent<T>, attrs, children)
}

export function uiPoll<T>(attrs: PollAttrs<T>, children?: Children): Vnode<PollAttrs<T>> {
  return m(PollComponent<T>, attrs, children)
}

export const PollWidgetComponent = <T>(): m.Component<PollWidgetAttrs<T>> => {
  return {
    view: ({ attrs: { tagName, label, field, class: className, ...rest } }) => {
      return uiWidget(
        {
          tagName: `${tagName || 'div'}.twk-input.twk-input-readonly`,
          label: label ?? (field as any),
          class: className,
        },
        m(PollComponent<T>, rest),
      )
    },
  }
}

export const PollComponent = <T>(): m.Component<PollAttrs<T>> => {
  let el: HTMLElement
  let timer: number
  let attrs: PollAttrs<T>

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
