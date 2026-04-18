import { Children } from 'mithril'
import {
  AngleComponent,
  ButtonAttrs,
  ButtonComponent,
  CheckboxComponent,
  ColorControl,
  ColorPicker,
  ControlAttrs,
  ControlComponent,
  Divider,
  Graph,
  GraphAttrs,
  GridComponent,
  GroupAttrs,
  GroupComponent,
  ImageAttrs,
  ImageComponent,
  ListComponent,
  NumberComponent,
  PointComponent,
  SelectComponent,
  SphericalComponent,
  Tabs,
  TextComponent,
  VectorComponent,
} from './components'
import { Component, ComponentDescriptor, ComponentSchema, ControlValue } from './core'
import { isFunction, isObject, isString } from './core/utils'

/**
 * @public
 */
export type BuilderFn = (b: Builder) => void

/**
 * @public
 */
export type TabsBuilderFn = (b: TabsBuilder) => void

/**
 * @public
 */
export interface TabsBuilder {
  group(label: string, builder: BuilderFn): GroupAttrs
}

function groupOptions<T extends Object>(b: Builder, args: IArguments) {
  let title: string | null = null
  let options: T & { title?: string } = {} as T
  let cb: BuilderFn | null = null

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (isString(arg)) {
      title = arg
    } else if (isObject(arg)) {
      options = arg as T
    } else if (isFunction(arg)) {
      cb = arg
    }
  }

  if (title) {
    options.title = title
  }

  const children: Builder['schema'] = []
  if (cb) {
    const controls = b.schema
    b.schema = children
    cb(b)
    b.schema = controls
  }
  return { options, children }
}

/**
 *
 * @public
 */
export class Builder {
  public static build(fn: BuilderFn) {
    const builder = new Builder()
    fn(builder)
    return builder.close()
  }

  public schema: ComponentSchema = []

  public close() {
    const result = this.schema
    this.schema = []
    return result
  }

  public group = this.createGroup(GroupComponent)
  public list = this.createGroup(ListComponent)
  public grid = this.createGroup(GridComponent)
  public tabs = this.createGroup(Tabs)

  public checkbox = this.createControl(CheckboxComponent)
  public text = this.createControl(TextComponent)
  public number = this.createControl(NumberComponent)
  public vector = this.createControl(VectorComponent)
  public select = this.createControl(SelectComponent)
  public color = this.createControl(ColorControl)
  public colorPicker = this.createControl(ColorPicker)
  public point = this.createControl(PointComponent)
  public spherical = this.createControl(SphericalComponent)
  public angle = this.createControl(AngleComponent)

  public button(text: string, opts: ButtonAttrs = {}) {
    opts.text = text
    return this.push(ButtonComponent, opts)
  }

  public graph(opts: Partial<GraphAttrs>): void
  public graph(label: string, opts: Partial<GraphAttrs>): void
  public graph() {
    const { options } = groupOptions<GraphAttrs>(this, arguments)
    return this.push(Graph, options)
  }

  public image(opts: Partial<ImageAttrs>): void
  public image(label: string, opts: Partial<ImageAttrs>): void
  public image() {
    const { options } = groupOptions<ImageAttrs>(this, arguments)
    return this.push(ImageComponent, options)
  }

  public control(content: Children | (() => Children)): void
  public control(label: string, content: Children | (() => Children)): void
  public control(opts: Partial<ControlAttrs>, content: Children | (() => Children)): void
  public control() {
    let options: Partial<ControlAttrs> = {}
    if (arguments.length === 1) {
      options.content = arguments[0]
    } else if (arguments.length === 2) {
      if (isString(arguments[0])) {
        options.label = arguments[0]
      } else {
        options = arguments[0]
      }
      options.content = arguments[1]
    }

    return this.push(ControlComponent, options)
  }

  public pre(content: Children | (() => Children)): void
  public pre(label: string, content: Children | (() => Children)): void
  public pre() {
    let label: string | undefined
    let content: Children | (() => Children)

    if (arguments.length === 1) {
      content = arguments[0]
    } else if (arguments.length === 2) {
      label = arguments[0]
      content = arguments[1]
    }
    return this.push(ControlComponent, {
      label,
      content,
      style: {
        whiteSpace: 'pre',
        fontFamily: 'monospace',
      },
    })
  }

  public divider(text?: string) {
    this.push(Divider, { text })
  }

  public push<Attrs extends Object>(
    component: Component<Attrs>,
    attributes: Attrs,
    children?: Array<ComponentDescriptor<any>>,
  ) {
    if (this.schema) {
      this.schema.push({ component, attributes, children })
    } else {
      throw new Error('Cannot use control builder after it was closed')
    }
  }

  private createControl<Attrs extends ControlValue<any, any>>(
    component: Component<Attrs>,
  ): AddControlFn<Attrs> {
    return function (this: Builder) {
      this.push(component, valueControlOptions<Attrs>(arguments))
    }.bind(this)
  }

  private createGroup<Attrs extends Object>(component: Component<Attrs>): AddGroupFn<Attrs> {
    return function (this: Builder) {
      const { options, children } = groupOptions<Attrs>(this, arguments)
      this.push(component, options, children)
    }.bind(this)
  }
}

// prettier-ignore
export type AddControlFn<T extends ControlValue<any, any>> =
  ((opts: T) => void) &
  (<V>(target: V, property: keyof V) => void) &
  (<V>(target: V, property: keyof V, opts: Omit<T, 'value' | 'key'>) => void)

export type AddGroupFn<T extends Object> = ((builder: BuilderFn) => void) &
  ((opts: Partial<T>) => void) &
  ((opts: Partial<T>, builder: BuilderFn) => void) &
  ((label: string, builder: BuilderFn) => void) &
  ((label: string, opts: Partial<T>) => void) &
  ((label: string, opts: Partial<T>, builder: BuilderFn) => void)

function valueControlOptions<T extends ControlValue<any, any> & ControlAttrs>(args: IArguments): T {
  let attr: T

  if (args.length === 1) {
    // 1. case: ui.control(opts)
    return args[0] || {}
  }
  if (args.length > 1) {
    attr = args[2] || {}
    attr.value = args[0]
    attr.prop = args[1]
    if (attr.label === undefined) {
      attr.label = String(attr.prop || '')
    }
  } else {
    attr = {} as T
  }

  return attr
}
