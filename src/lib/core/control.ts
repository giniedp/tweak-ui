import { ValueField } from './types'

/**
 * Gets a value of a view model
 *
 * @public
 * @param control - The model of a component
 */
export function getControlValue<V>(control: ValueField<any, V>): V {
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
export function setControlValue<V, R>(control: ValueField<any, V>, value: V) {
  const raw = fromControl(control, value)
  setRawValue(control, raw)
  return raw
}

export function getRawValue(model: ValueField<any, any>) {
  if (model.field) {
    return model.value?.[model.field!]
  }
  return model.value
}

export function setRawValue(model: ValueField<any, any>, value: any): void {
  if (!model.field) {
    model.value = value
    return
  }
  if (isWriteable(model.value, model.field)) {
    model.value[model.field] = value
    return
  }
  console.warn(
    `Cannot write value to control model. Property "${String(model.field)}" is not writeable.`,
  )
}

function isWriteable<T>(obj: T, key: keyof T): boolean {
  const desc = Object.getOwnPropertyDescriptor(obj, key)
  return !desc || !!desc.writable || !!desc.set
}

function fromControl<Value>(source: ValueField<unknown, Value>, value: Value): unknown {
  if (source.adapter) {
    return source.adapter.fromControl(value)
  }
  return value
}

function toControl<Value>(source: ValueField<unknown, Value>, raw: unknown): Value {
  if (source.adapter) {
    return source.adapter.toControl(raw)
  }
  return raw as any
}
