# Concepts

## Mithril.js

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
let value = 50
ui.scalar({
  value,
  onchange: (v) => (value = v),
})
```

**Object + property binding**

```ts
const model = {
  value: 50,
}
// ...
ui.scalar({
  value: model,
  prop: 'value',
})
// or better
ui.scalar(model, 'value', {
  // other options
})
```

**Object + custom binding**

```ts
const model = { value: 50 }
ui.scalar({
  value: model,
  binding: {
    get: (it) => it.value,
    set: (v, it) => (it.value = v),
  },
})
```

These approaches enable both simple and reactive data flows depending on the use case.

## Widget wrapper item

A `Widget` is a standardized UI wrapper providing label and content layout. Most tweakable controls are built on it, ensuring visual consistency. It can also be used independently to present arbitrary content.

## Custom controls

Custom UI can be implemented directly using Mithril components, no registration step is required.

However, the builder API itself is not extensible; only built-in controls are available through it. For custom behavior, render components outside the builder or alongside it.

Refer to <a href="https://mithril.js.org/components.html" target="_blank">Mithril.js</a>
component documentation and existing library source code for implementation patterns.

<Example name="example-custom-control.ts"/>
<ExampleCode name="example-custom-control.ts"/>
