import { TweakableAttrs } from './types'
import { isObject } from './utils'

/**
 * Gets a value of a view model
 *
 * @public
 * @param control - The model of a component
 */
export function getControlValue<V>(control: TweakableAttrs<any, V>): V {
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
export function setControlValue<V, R>(control: TweakableAttrs<any, V>, value: V) {
  const raw = fromControl(control, value)
  setRawValue(control, raw)
  return raw
}

export function getRawValue(attrs: TweakableAttrs<any, any>) {
  if (attrs.binding) {
    return attrs.binding.get(attrs.value, attrs.field)
  }
  if (attrs.value == null) {
    return null
  }
  if (attrs.field != null) {
    return attrs.value[attrs.field]
  }
  return attrs.value
}

export function setRawValue(attrs: TweakableAttrs<any, any>, value: any): void {
  if (attrs.binding) {
    attrs.binding.set?.(value, attrs.value, attrs.field)
    return
  }
  if (attrs.value == null) {
    return
  }
  if (attrs.field) {
    if (!isWriteable(attrs.value, attrs.field)) {
      console.warn(
        `Cannot write value to control model. Property "${String(attrs.field)}" is not writeable.`,
      )
      return
    }
    attrs.value[attrs.field] = value
    return
  }
  attrs.value = value
}

function isWriteable<T>(obj: T, key: keyof T): boolean {
  const desc = Object.getOwnPropertyDescriptor(obj, key)
  return !desc || !!desc.writable || !!desc.set
}

function fromControl<Value>(source: TweakableAttrs<unknown, Value>, value: Value): unknown {
  if (source.adapter) {
    return source.adapter.fromControl(value)
  }
  return value
}

function toControl<Value>(source: TweakableAttrs<unknown, Value>, raw: unknown): Value {
  if (source.adapter) {
    return source.adapter.toControl(raw)
  }
  return raw as any
}
