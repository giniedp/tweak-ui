import { Children } from 'mithril'
import {
  AngleComponent,
  BarComponent,
  BarContentComponent,
  BarEndComponent,
  BarStartComponent,
  BooleanComponent,
  ButtonAttrs,
  ButtonComponent,
  ColorControl,
  ColorPicker,
  ControlAttrs,
  ControlComponent,
  Divider,
  FlexComponent,
  GraphAttrs,
  GraphComponent,
  GridComponent,
  GroupAttrs,
  GroupComponent,
  ImageAttrs,
  ImageComponent,
  InputComponent,
  MatrixComponent,
  NumberComponent,
  PageComponent,
  PageFooterComponent,
  PageHeaderComponent,
  PointComponent,
  SelectComponent,
  SphericalComponent,
  SplitComponent,
  SplitContentComponent,
  TabsComponent,
  TextComponent,
  TreeAttrs,
  TreeComponent,
  VectorComponent,
} from './components'
import { Component, ComponentChildren, ComponentSchema, OmitIn, ValueField } from './core'
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

  public group = groupGenerator(this, GroupComponent)

  public flex = componentGenerator(this, FlexComponent)
  public grid = componentGenerator(this, GridComponent)
  public tabs = componentGenerator(this, TabsComponent)
  public split = componentGenerator(this, SplitComponent)
  public splitContent = componentGenerator(this, SplitContentComponent)
  public page = componentGenerator(this, PageComponent)
  public pageHeader = componentGenerator(this, PageHeaderComponent)
  public pageFooter = componentGenerator(this, PageFooterComponent)
  public bar = componentGenerator(this, BarComponent)
  public barStart = componentGenerator(this, BarStartComponent)
  public barEnd = componentGenerator(this, BarEndComponent)
  public barContent = componentGenerator(this, BarContentComponent)

  public input = fieldGenerator(this, InputComponent)
  public boolean = fieldGenerator(this, BooleanComponent)
  public checkbox = fieldGenerator(this, BooleanComponent)
  public string = fieldGenerator(this, TextComponent)
  public text = fieldGenerator(this, TextComponent)
  public number = fieldGenerator(this, NumberComponent)
  public select = fieldGenerator(this, SelectComponent)

  public vector = fieldGenerator(this, VectorComponent)
  public matrix = fieldGenerator(this, MatrixComponent)

  public color = fieldGenerator(this, ColorControl)
  public colorPicker = fieldGenerator(this, ColorPicker)

  public angle = fieldGenerator(this, AngleComponent)
  public point = fieldGenerator(this, PointComponent)
  public spherical = fieldGenerator(this, SphericalComponent)

  public button(text: string, opts: ButtonAttrs = {}) {
    this.add(ButtonComponent, opts, text)
  }

  public image(opts: ImageAttrs) {
    this.add(ImageComponent, opts)
  }

  public divider(content?: Children) {
    this.add(Divider, {}, content)
  }

  public tree<T>(opts: TreeAttrs<T>) {
    this.add(TreeComponent, opts)
  }

  public graph(opts: GraphAttrs) {
    this.add(GraphComponent, opts)
  }

  public display(label: string, children?: ComponentChildren) {
    this.add(ControlComponent, { label }, children)
  }

  public pre(label: string, children?: ComponentChildren) {
    this.add(
      ControlComponent,
      {
        label,
        style: {
          whiteSpace: 'pre',
        },
      },
      children,
    )
  }

  /**
   * Adds a render function as a component
   * This breaks out of the static builder schema and allows for dynamic content.
   */
  public view(view: () => Children) {
    this.add({ view })
  }

  /**
   * Adds a render function as a component
   * This breaks out of the static builder schema and allows for dynamic content.
   */
  public control(attrs: ControlAttrs, children?: ComponentChildren) {
    this.add(ControlComponent, attrs, children)
  }

  /**
   * Adds a component to the builder schema
   */
  public add<Attrs extends Object>(
    component: Component<Attrs> | string,
    attributes?: Attrs,
    children?: ComponentChildren,
  ) {
    if (this.schema) {
      this.schema.push({ component, attributes, children })
    } else {
      throw new Error('Cannot use control builder after it was closed')
    }
  }
}

export type GroupGenerator<T extends Object> = {
  (builder: BuilderFn): void
  (opts: Partial<T>): void
  (opts: Partial<T>, builder: BuilderFn): void
  (label: string, builder: BuilderFn): void
  (label: string, opts: Partial<T>): void
  (label: string, opts: Partial<T>, builder: BuilderFn): void
}

function groupGenerator<Attrs extends Object>(
  builder: Builder,
  component: Component<Attrs>,
): GroupGenerator<Attrs> {
  return function () {
    const { options, children } = groupOptions<Attrs>(builder, arguments)
    builder.add(component, options, children)
  }
}

export type FieldGenerator<A extends ValueField<any, any>> = {
  (opts: A): void
  <V, K extends keyof V>(target: V, property: K): void
  <V, K extends keyof V>(target: V, property: K, opts: OmitIn<A, 'value' | 'field'>): void
}

function fieldGenerator<A extends ValueField<any, any>>(
  builder: Builder,
  component: Component<A>,
): FieldGenerator<A> {
  return function () {
    builder.add(component, fieldOptions<A>(arguments))
  }
}

export type ComponentGenerator<T extends Object> = {
  (builder: BuilderFn): void
  (opts: Partial<T>): void
  (opts: Partial<T>, builder: BuilderFn): void
}

function componentGenerator<Attrs extends Object>(
  builder: Builder,
  component: Component<Attrs>,
): ComponentGenerator<Attrs> {
  return function () {
    const { options, children } = componentOptions<Attrs>(builder, arguments)
    builder.add(component, options, children)
  }
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

function fieldOptions<T extends ValueField<any, any> & ControlAttrs>(args: IArguments): T {
  let attr: T

  if (args.length === 1) {
    return args[0] || {}
  }
  if (args.length > 1) {
    attr = args[2] || {}
    attr.value = args[0]
    attr.field = args[1]
    if (attr.label === undefined) {
      attr.label = String(attr.field || '')
    }
  } else {
    attr = {} as T
  }

  return attr
}

function componentOptions<T extends Object>(b: Builder, args: IArguments) {
  let options: T | null = null
  let cb: BuilderFn | null = null

  if (!args.length) {
    return { options: {} as T, children: [] }
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (isObject(arg)) {
      options = arg as T
    } else if (isFunction(arg)) {
      cb = arg
    }
  }

  const children: Builder['schema'] = []
  if (cb) {
    const controls = b.schema
    b.schema = children
    cb(b)
    b.schema = controls
  }
  return { options: options || ({} as T), children }
}
