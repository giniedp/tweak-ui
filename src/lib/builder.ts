import { Children } from 'mithril'
import {
  AngleInputComponent,
  AngleWidgetComponent,
  BarComponent,
  BarContentComponent,
  BarEndComponent,
  BarStartComponent,
  BitmaskInputComponent,
  BitmaskWidgetComponent,
  BoolInputComponent,
  BoolWidgetComponent,
  ButtonAttrs,
  ButtonComponent,
  ColorComponent,
  ColorPicker,
  ColorPickerWidgetComponent,
  ColorWidgetComponent,
  Divider,
  FlexComponent,
  GraphAttrs,
  GraphComponent,
  GridComponent,
  GroupAttrs,
  GroupComponent,
  ImageAttrs,
  ImageComponent,
  MatrixInputComponent,
  MatrixWidgetComponent,
  PointInputComponent,
  PointWidgetComponent,
  PollComponent,
  PollWidgetComponent,
  ScalarInputComponent,
  ScalarWidgetComponent,
  SectionComponent,
  SectionFooterComponent,
  SectionHeaderComponent,
  SelectComponent,
  SphericalInputComponent,
  SphericalWidgetComponent,
  SplitComponent,
  SplitContentComponent,
  StringInputComponent,
  StringWidgetComponent,
  TabsComponent,
  TreeAttrs,
  TreeComponent,
  VectorInputComponent,
  VectorWidgetComponent,
  WidgetAttrs,
  WidgetComponent,
} from './components'
import { Component, ComponentChildren, ComponentSchema, OmitIn, TweakableAttrs } from './core'
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
  public section = componentGenerator(this, SectionComponent)
  public sectionHeader = componentGenerator(this, SectionHeaderComponent)
  public sectionFooter = componentGenerator(this, SectionFooterComponent)
  public bar = componentGenerator(this, BarComponent)
  public barStart = componentGenerator(this, BarStartComponent)
  public barEnd = componentGenerator(this, BarEndComponent)
  public barContent = componentGenerator(this, BarContentComponent)

  public bool = widgetGenerator(this, BoolWidgetComponent)
  public string = widgetGenerator(this, StringWidgetComponent)
  public scalar = widgetGenerator(this, ScalarWidgetComponent)
  public vector = widgetGenerator(this, VectorWidgetComponent)
  public matrix = widgetGenerator(this, MatrixWidgetComponent)
  public select = widgetGenerator(this, SelectComponent)
  public angle = widgetGenerator(this, AngleWidgetComponent)
  public bitmask = widgetGenerator(this, BitmaskWidgetComponent)
  public poll = widgetGenerator(this, PollWidgetComponent)
  public color = widgetGenerator(this, ColorWidgetComponent)
  public colorPicker = widgetGenerator(this, ColorPickerWidgetComponent)
  public point = widgetGenerator(this, PointWidgetComponent)
  public spherical = widgetGenerator(this, SphericalWidgetComponent)

  public boolInput = widgetGenerator(this, BoolInputComponent)
  public stringInput = widgetGenerator(this, StringInputComponent)
  public scalarInput = widgetGenerator(this, ScalarInputComponent)
  public vectorInput = widgetGenerator(this, VectorInputComponent)
  public matrixInput = widgetGenerator(this, MatrixInputComponent)
  public selectInput = widgetGenerator(this, SelectComponent)
  public angleInput = widgetGenerator(this, AngleInputComponent)
  public bitmaskInput = widgetGenerator(this, BitmaskInputComponent)
  public pollInput = widgetGenerator(this, PollComponent)
  public colorInput = widgetGenerator(this, ColorComponent)
  public colorPickerInput = widgetGenerator(this, ColorPicker)
  public pointInput = widgetGenerator(this, PointInputComponent)
  public sphericalInput = widgetGenerator(this, SphericalInputComponent)

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

  public widget(label: string, children?: ComponentChildren) {
    this.add(WidgetComponent, { label }, children)
  }

  public pre(label: string, children?: ComponentChildren) {
    this.add(
      WidgetComponent,
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
  public control(attrs: WidgetAttrs, children?: ComponentChildren) {
    this.add(WidgetComponent, attrs, children)
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

export type FieldGenerator<A extends TweakableAttrs<any, any>> = {
  (opts: A): void
  <V, K extends keyof V>(target: V, property: K): void
  <V, K extends keyof V>(target: V, property: K, opts: OmitIn<A, 'value' | 'field'>): void
}

function widgetGenerator<A extends TweakableAttrs<any, any>>(
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

function fieldOptions<T extends TweakableAttrs<any, any> & WidgetAttrs>(args: IArguments): T {
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
