# Concepts

## Mithril.js

This library is based on [mithril](https://mithril.js.org/). All key concepts of mithril
also apply to this library. Check mithril documentation when writing custom controls for Tweak UI

## Value binding

There are several ways how to provide and retreive input values.

Use the `value` property to set the inital value and then listen for change

```js
TweakUi.mount("#container", [{
  type: "text",
  label: "My text",
  value: "i have a label",
  onInput: (it, value) => { console.log(it, value) }
}])
```

Use getters and setters

```js
TweakUi.mount("#container", [{
  type: "text",
  label: "Page Title",
  get value() { return window.document.title },
  set value(v) { window.document.title = v },
  onInput: (it, value) => { console.log(it, value) }
}])
```

Use a `target` object and provide a `property` name to get and set the value

```js
TweakUi.mount("#container", [{
  type: "text",
  label: "Page Title",
  target: window.document,
  property: "title"
}])
```

## Labels

The main container has a fixed width of `20rem` which is `320px` on this page.
All controlls are stacked vertically. The default stylesheet uses the <code>flex-box</code> layout model
which should render just fine on <a href="https://caniuse.com/#feat=flexbox" target="_blank"> all modern browsers </a>

Almost all controls have a label to their left side. Hhowever this is only rendered if the <code>label</code> option
is actually set. If you want to alignt the controls vertically you have to set the <code>label</code> option
at least to an empty string.

<Example name="example-labels.ts"/>
<ExampleCode name="example-labels.ts"/>

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
