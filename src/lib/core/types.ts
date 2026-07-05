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

export function binding<T>(target: T, field: keyof T): ValueBinding<T, T[keyof T]> {
  return {
    get: () => target[field],
    set: (value) => (target[field] = value),
  }
}

/**
 * A get/set pair that encapsulates access to a value without exposing the source object.
 *
 * @public
 */
export type ValueBinding<M, T> = {
  get: (model: M, field?: keyof M) => T
  set?: (value: T, model: M, field?: keyof M) => void
}

export type TweakableAttrs<T, Value = unknown> = {
  /**
   * The target object being tweaked.
   */
  value: T
  /**
   * The property on `value` to read from and write to
   */
  field?: keyof T
  /**
   * The custom binding controller
   */
  binding?: ValueBinding<T, Value>
  /**
   * An optional adapter to convert between the raw value and the control value.
   */
  adapter?: ControlAdapter<any, Value>
}

/**
 * Converts between the raw stored value and the value the control operates on.
 * Use when the control's internal representation differs from the source data format
 * e.g. radians stored, degrees displayed; or a packed integer unpacked into a vector.
 *
 * @public
 */
export type ControlAdapter<RawValue, ControlValue> = {
  toControl: (value: RawValue) => ControlValue
  fromControl: (value: ControlValue) => RawValue
}

export type OmitIn<A, Keys extends keyof A> = {
  [P in keyof A as P extends Keys ? never : P]: A[P]
}
