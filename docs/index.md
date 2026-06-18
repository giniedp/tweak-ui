---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Tweak UI'
  text: ''
  tagline: A lightweight tweak controls library
  actions:
    - theme: brand
      text: Components
      link: /components
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
mountUi('.my-element', (b) => {
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
