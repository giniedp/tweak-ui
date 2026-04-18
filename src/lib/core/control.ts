/**
 * Utility to convert a value from a raw format to a control format and back.
 *
 * @public
 */
export type ControlValueAdapter<RawValue, ControlValue> = {
  toControl: (value: RawValue) => ControlValue
  fromControl: (value: ControlValue) => RawValue
}

export type ControlValue<T, Value> = {
  /**
   * The raw value of the control, used when `target` and `property` are not set.
   */
  value: T
  /**
   * The property name in `value` where the raw value is stored.
   *
   * @remarks
   * Requires the `target` option to be set.
   */
  prop?: keyof T
  /**
   * An optional adapter to convert between the raw value and the control value.
   */
  adapter?: ControlValueAdapter<any, Value>
}

/**
 * Gets a value of a view model
 *
 * @public
 * @param control - The model of a component
 */
export function getControlValue<V>(control: ControlValue<any, V>): V {
  return toControl(control, getRawValue(control))
}

/**
 * Sets a value on a view model
 *
 * @public
 * @param control - The model of a component
 * @param value - The value for the component
 * @returns the encoded value as it was written to the model
 */
export function setControlValue<V, R>(control: ControlValue<any, V>, value: V) {
  const raw = fromControl(control, value)
  setRawValue(control, raw)
  return raw
}

export function getRawValue(model: ControlValue<any, any>) {
  if (model.prop) {
    return model.value?.[model.prop!]
  }
  return model.value
}

export function setRawValue(model: ControlValue<any, any>, value: any): void {
  if (!model.prop) {
    model.value = value
    return
  }
  if (isWriteable(model.value, model.prop)) {
    model.value[model.prop] = value
    return
  }
  console.warn(
    `Cannot write value to control model. Property "${String(model.prop)}" is not writeable.`,
  )
}

function isWriteable<T>(obj: T, key: keyof T): boolean {
  const desc = Object.getOwnPropertyDescriptor(obj, key)
  return !desc || !!desc.writable || !!desc.set
}

function fromControl<Value>(source: ControlValue<unknown, Value>, value: Value): unknown {
  if (source.adapter) {
    return source.adapter.fromControl(value)
  }
  return value
}

function toControl<Value>(source: ControlValue<unknown, Value>, raw: unknown): Value {
  if (source.adapter) {
    return source.adapter.toControl(raw)
  }
  return raw as any
}
