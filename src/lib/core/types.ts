import type { ClassComponent, FactoryComponent } from 'mithril'

/**
 * A UI component, which can be either a Mithril factory component or a Mithril class component.
 *
 * @public
 */
export type Component<Attr extends Object> = FactoryComponent<Attr> | ClassComponent<Attr>

/**
 * A descriptor for a component, which includes the component itself, its attributes, and optionally its children.
 *
 * @internal
 */
export type ComponentDescriptor<Attr extends Object> = {
  component: Component<Attr>
  attributes: Attr
  children?: Array<ComponentDescriptor<any>>
}

/**
 * A schema for a set of components, which is an array of component descriptors.
 *
 * @internal
 */
export type ComponentSchema = Array<ComponentDescriptor<any>>
