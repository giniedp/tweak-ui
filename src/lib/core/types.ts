import type { Children, ClassComponent, FactoryComponent } from 'mithril'

export type EventAttrs = Partial<GlobalEventHandlers>

export type StyleAttr = Partial<CSSStyleDeclaration> & { [key: string]: any }

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
  component: Component<Attr> | string
  attributes: Attr
  children?: ComponentChildren
}

/**
 *
 */
export type ComponentChildren = ComponentSchema | Children | (() => Children)

/**
 * A schema for a set of components, which is an array of component descriptors.
 *
 * @internal
 */
export type ComponentSchema = Array<ComponentDescriptor<any>>

export type ValueField<T, Value = unknown> = {
  /**
   * The raw value of the control, or the object containing it if `field` is set.
   */
  value: T
  /**
   * The property name in `value` where the raw value is stored.
   */
  field?: keyof T
  /**
   * An optional adapter to convert between the raw value and the control value.
   */
  adapter?: ValueFieldAdapter<any, Value>
}

/**
 * Utility to convert a value from a raw format to a control format and back.
 *
 * @public
 */
export type ValueFieldAdapter<RawValue, ControlValue> = {
  toControl: (value: RawValue) => ControlValue
  fromControl: (value: ControlValue) => RawValue
}

export type OmitIn<A, Keys extends keyof A> = {
  [P in keyof A as P extends Keys ? never : P]: A[P]
}
