# Concepts

## Mithril.js

This library is based on [Mithril.js](https://mithril.js.org/). All key concepts of mithril
also apply to this library. Check mithril documentation when writing custom controls for Tweak UI

## UI Builder

Tweak UI provides a builder API on top of Mithril to simplify constructing control panels.

```ts
import { mountUi } from 'tweak-ui'

mountUi('.your-selector', (ui) => {
  ui.button('Click me')
})
```

The builder collects control definitions during execution and compiles them into a Mithril component. There is no `return` value. This process runs once at `mountUi` call time, so controls are static and cannot be added or removed dynamically.

## Value binding

Controls receive input through the `value` property. Supported patterns:

**Static value**

```ts
ui.number({
  value: 50,
})
```

**Getter / Setter**

```ts
ui.number({
  get value() {
    return value
  },
  set value(newValue) {
    value = newValue
  },
})
```

**Object + property binding**

```ts
const object = {
  myValue: 50,
}
// ...
ui.number({
  value: object,
  prop: 'myValue',
})
// or better
ui.number(object, 'myValue', {
  // other options
})
```

These approaches enable both simple and reactive data flows depending on the use case.

## Control wrapper item

A `control` is a standardized UI wrapper providing label and description layout. Most tweakable controls are built on it, ensuring visual consistency. It can also be used independently to present arbitrary content.

## Custom controls

Custom UI can be implemented directly using Mithril components, no registration step is required.

However, the builder API itself is not extensible; only built-in controls are available through it. For custom behavior, render components outside the builder or alongside it.

Refer to <a href="https://mithril.js.org/components.html" target="_blank">Mithril.js</a>
component documentation and existing library source code for implementation patterns.

<Example name="example-custom-control.ts"/>
<ExampleCode name="example-custom-control.ts"/>
