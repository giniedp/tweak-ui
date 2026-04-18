---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Tweak UI"
  text: ""
  tagline: A lightweight tweak controls library
  actions:
    - theme: alt
      text: API
      link: /api
    - theme: brand
      text: Components
      link: /components
---
<!-- features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit -->

## Getting started

Install

```shell
npm install tweak-ui
```

Import

```ts
import { mountUi } from "tweak-ui"
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
mountUi(".my-element", (b) => {
  // ... builder function
})
```
