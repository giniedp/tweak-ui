# Concepts

## Mithril.js

This library is based on [mithril](https://mithril.js.org/). All key concepts of mithril
also apply to this library. Check mithril documentation when writing custom controls for Tweak UI

## UI Builder

Tweak UI adds a UI builder on top of mithril to improve the developer experience for this specific use case.
This is how you can create a UI with Tweak UI:

```ts
import { mountUi } from 'tweak-ui'

mountUi('.your-selector', (ui) => {
  ui.button('Click me')
})
```

Mention there is no `return` statement. All control definitions are captured by the builder and rendered into a mithril component. This happens only ince when you call `mountUi`, hence you can not dynamically add or remove controls.

## Value binding

There are several ways how to provide input valiuse to controls. All of them use the `value` property.
For a simple, static use case it would be enough to just set the `value` property to a primitive value.

```ts
ui.number({
  value: 50,
})
```

The `value` may also be a getter and optionally a setter.

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

And finally, the value may be an object and a property name to get and set the value.

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

## Custom controls

Register your custom controls by using the <code>component</code> function.
The argument must be a unique name and a component class or component factory.
Consult the documentation of <a href="https://mithril.js.org/components.html" target="_blank">mithriljs</a>
for how the components work. Take a look at the source code for how Tweak Ui components are
implemented.

<Example name="example-custom-control.ts"/>
<ExampleCode name="example-custom-control.ts"/>

## Theme

Tweak ui comes with a default theme and the alternatives `.twui-dark` and `.twui-light`.
Add one of these classes to the root element to change the look.

Another quick and easy way is to change the CSS variables for the root element.
However <a href="https://caniuse.com/#feat=css-variables" target="_blank">not all browsers</a> support that.
Read more about CSS variables
<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">here </a>,
<a target="_blank" href="https://www.w3schools.com/css/css3_variables.asp">here </a> or
<a target="_blank" href="https://medium.freecodecamp.org/learn-css-variables-in-5-minutes-80cf63b4025d">here </a>
