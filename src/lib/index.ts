/**
 * Tweak UI is a lightweight js library for building input controls with data binding
 *
 * @remarks
 * The library provides a set of common ui components built with mithriljs. The main objective
 * is to allow a developer to rapidly scaffold input interfaces for manipulating javascript objects
 * at runtime.
 *
 * Similar projects are:
 * {@link https://github.com/dataarts/dat.gui | dat.GUI}
 * {@link https://github.com/automat/controlkit.js | controlkit}
 * {@link https://github.com/colejd/guify | guify}
 *
 * @packageDocumentation
 */

import './accordeon'
import './button'
import './button-group'
import './checkbox'
import './color'
import './color-picker'
import './group'
import './custom'
import './image'
import './number'
import './panel'
import './pad'
import './select'
import './tabs'
import './text'
import './vector'
import './direction'

export * from './core'
export * from './color-formats'
export * from './builder'
export * from './types'

export * from './accordeon'
export * from './button'
export * from './button-group'
export * from './checkbox'
export * from './color'
export * from './color-picker'
export * from './group'
export * from './custom'
export * from './image'
export * from './number'
export * from './panel'
export * from './pad'
export * from './select'
export * from './tabs'
export * from './text'
export * from './vector'
export * from './direction'

declare const VERSION_STRING: string

/**
 * The version string
 *
 * @public
 */
export const VERSION = VERSION_STRING
