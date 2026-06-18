import m, { ChildArrayOrPrimitive, Children, FactoryComponent, Vnode } from 'mithril'
import { ComponentChildren, ComponentDescriptor } from './types'

export function isVnode(child: Children): child is Vnode {
  return typeof child === 'object' && child != null && 'tag' in child
}

export function mapChildren(
  nodes: ChildArrayOrPrimitive | undefined,
  fn: (child: Vnode, index: number, all: Children[]) => Children,
) {
  if (Array.isArray(nodes)) {
    return nodes.map((it, i, list) => {
      if (isVnode(it)) {
        return fn(it, i, list)
      }
      return it
    })
  }
  if (isVnode(nodes)) {
    return fn(nodes, 0, [nodes])
  }
  return nodes
}

export function renderChildren(children: ComponentChildren): Children {
  if (children == null) {
    return null
  }
  if (typeof children === 'function') {
    return children()
  }
  if (Array.isArray(children)) {
    return children.map((it) => {
      if (isDescriptor(it)) {
        const { component, attributes, children } = it
        return m(component as any, attributes, renderChildren(children || []))
      }
      return it
    })
  }
  return children
}

function isDescriptor(child: any): child is ComponentDescriptor<any> {
  return typeof child === 'object' && child != null && 'component' in child && 'attributes' in child
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
