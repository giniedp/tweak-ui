import m, { ChildArrayOrPrimitive, Children, FactoryComponent, Vnode } from 'mithril'
import { ControlValue } from './control'
import { ComponentSchema } from './types'

export function isVnode(child: Children): child is Vnode {
  return typeof child === 'object' && child != null && 'tag' in child
}

export function mapChildren(
  nodes: ChildArrayOrPrimitive | undefined,
  fn: (child: Vnode) => Children,
) {
  if (Array.isArray(nodes)) {
    return nodes.map((it) => {
      if (isVnode(it)) {
        return fn(it)
      }
      return it
    })
  }
  if (isVnode(nodes)) {
    return fn(nodes)
  }
  return nodes
}

export function renderSchema(schema: ComponentSchema): Children {
  if (!schema?.length) {
    return null
  }
  return schema.map(({ component, attributes, children }) => {
    return m(component, attributes, renderSchema(children || []))
  })
}

// prettier-ignore
export type LabeledFn<T> =
  & ((opts: T) => Vnode<T> | null)
  & ((label: string, opts: Omit<T, 'label'>) => Vnode<T> | null)

export function labeledFn<T>(component: FactoryComponent<T>): LabeledFn<T> {
  return () => {
    let attr: T & { label?: string }
    if (arguments.length === 1) {
      attr = arguments[0] || {}
    } else if (arguments.length > 1) {
      attr = arguments[1] || {}
      attr.label = arguments[0]
    } else {
      attr = {} as T & { label?: string }
    }
    return m(component, attr)
  }
}
