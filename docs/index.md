---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Tweak UI'
  text: ''
  tagline: Live tweak panels for numbers, colors, vectors and more.
  actions:
    - theme: brand
      text: Components
      link: /components
    - theme: alt
      text: Concepts
      link: /concepts

features:
  - title: Declarative Builder
    details: Compose panels from numbers, vectors, colors, selects and more, plus layout containers like groups, tabs and split panes.
  - title: No Build Step
    details: Built on Mithril.js, components are plain functions, meaning that custom controls can be added without the need for a compiler.
  - title: Themeable by Design
    details: A minimal CSS vocabulary of classes and custom properties. Just enough for small projects.
    link: /style
    linkText: Explore the style guide
---

## Getting started

Install

```shell
npm install tweak-ui
```

Import

```ts
import { mountUi } from 'tweak-ui'
```

Find stylehseets

```
node_modules/tweak-ui/tweak-ui.css
```

Create an HTML container where Tweak UI should render.

```html
<div class="my-element"></div>
```

Mount your controls

```ts
mountUi('.my-element', (ui) => {
  // ... builder function for static controls
})
```

Or with full mithril control

```ts
mountUi('.my-element', {
  view: () => {
    // ... mithril view function for dynamic controls
  },
})
```
