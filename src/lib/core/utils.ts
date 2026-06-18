/**
 * Checks if value is a string
 * @internal
 */
export function isString(v: any): v is string {
  return typeof v === 'string'
}
/**
 * Checks if value is a number
 * @internal
 */
export function isNumber(v: any): v is number {
  return typeof v === 'number'
}
/**
 * Checks if value is a function
 * @internal
 */
export function isFunction(v: any): v is (...args: any[]) => any {
  return typeof v === 'function'
}
/**
 * Checks if value is an array
 * @internal
 */
export function isArray(v: any): v is any[] {
  return Array.isArray(v)
}
/**
 * Checks if value is an object
 * @internal
 */
export function isObject(v: any): v is object {
  return v != null && typeof v === 'object' && !isArray(v)
}
/**
 * Calls a function if it is not null
 * @internal
 */
export function call<T extends (...args: any) => any>(
  cb: T | null | undefined,
  ...args: Parameters<T>
) {
  return isFunction(cb) ? cb(...args) : null
}

/**
 * Clamps a number value
 * @internal
 */
export function clamp(v: number, min: number, max: number): number {
  if (v != null) {
    if (min != null && v < min) {
      return min
    }
    if (max != null && v > max) {
      return max
    }
  }
  return v
}

export type ClassValue =
  | string
  | null
  | undefined
  | false
  | ClassDictionary
  | ClassArray
  | (() => ClassValue)

export interface ClassDictionary {
  [key: string]: boolean | (() => boolean)
}

export interface ClassArray extends Array<ClassValue> {}

export function uiStyle(
  style: Partial<CSSStyleDeclaration> | undefined,
): Partial<CSSStyleDeclaration> {
  return style || {}
}

/**
 * Builds a css class from various argument types
 * @param exp
 */
export function uiClass(...args: ClassValue[]): string
export function uiClass(): string {
  // common case
  if (arguments.length === 1 && isString(arguments[0])) {
    return arguments[0] as string
  }
  if (arguments.length === 0) {
    return ''
  }

  const result: string[] = []

  const process = (value: ClassValue): void => {
    if (!value) return

    // function
    if (typeof value === 'function') {
      process(value())
      return
    }

    // string
    if (typeof value === 'string') {
      if (value) {
        result.push(value)
      }
      return
    }

    // array
    if (Array.isArray(value)) {
      for (const v of value) {
        process(v)
      }
      return
    }

    // object
    if (typeof value === 'object') {
      for (const key in value) {
        const v = value[key]
        const resolved = typeof v === 'function' ? v() : v
        if (resolved) result.push(key)
      }
    }
  }

  for (const arg of arguments) {
    process(arg)
  }

  return result.join(' ')
}

/**
 * Pads a string
 * @internal
 */
export function padLeft(value: string, length: number, char: string) {
  while (value.length < length) {
    value = `${char}${value}`
  }
  return value
}

/**
 * Gets current mouse coordinates from mouse or touch event
 * @internal
 */
export function getTouchPoint(e: MouseEvent | TouchEvent): [number, number] {
  let cx = 0
  let cy = 0
  if ('touches' in e) {
    cx = e.touches.item(0)!.pageX
    cy = e.touches.item(0)!.pageY
  } else {
    cx = e.pageX
    cy = e.pageY
  }
  return [cx, cy]
}

export function getTouchInTarget(
  e: MouseEvent | TouchEvent,
  target?: HTMLElement | null,
  offset?: [number, number],
) {
  target = target || (e.target as HTMLElement)
  const rect = target.getBoundingClientRect()
  const tx = window.pageXOffset || document.documentElement.scrollLeft
  const ty = window.pageYOffset || document.documentElement.scrollTop

  const cw = target.clientWidth
  const ch = target.clientHeight
  let [cx, cy] = getTouchPoint(e)
  if (offset) {
    cx += offset[0]
    cy += offset[1]
  }
  const x = cx - tx - rect.left
  const y = cy - ty - rect.top
  return {
    width: cw,
    height: ch,
    x: x,
    y: y,
    normalizedX: x / cw,
    normalizedY: y / ch,
  }
}

export function dragUtil({
  onStart,
  onMove,
  onEnd,
}: {
  onStart?: (e: MouseEvent | TouchEvent) => void
  onMove?: (e: MouseEvent | TouchEvent) => void
  onEnd?: (e: MouseEvent | TouchEvent) => void
}) {
  const util = {
    target: null as HTMLElement | null,
    activate: (e: MouseEvent) => {
      util.deactivate()
      util.target = e.target as HTMLElement
      if (onStart) {
        onStart(e)
      }
      if (onMove) {
        document.addEventListener('mousemove', onMove, { passive: false })
        document.addEventListener('touchmove', onMove, { passive: false })
      }
      if (onEnd) {
        document.addEventListener('mouseup', onEnd)
        document.addEventListener('touchend', onEnd)
        document.addEventListener('touchcancel', onEnd)
      }
    },
    deactivate: () => {
      util.target = null
      if (onMove) {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('touchmove', onMove)
      }
      if (onEnd) {
        document.removeEventListener('mouseup', onEnd)
        document.removeEventListener('touchend', onEnd)
        document.removeEventListener('touchcancel', onEnd)
      }
    },
    onStart,
    onMove,
    onEnd,
  }
  return util
}

export function eventWithTimout(el: Element, event: string, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    let didResolve = false
    const handler = (e: Event) => {
      didResolve = true
      el.removeEventListener(event, handler)
      resolve(true)
    }
    el.addEventListener(event, handler)
    setTimeout(() => {
      el.removeEventListener(event, handler)
      if (!didResolve) {
        didResolve = true
        resolve(false)
      }
    }, timeout)
  })
}
