// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import './style.css'
import 'tweak-ui/style.css'

import ExampleCode from './components/example-code.vue'
import Example from './components/example.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Example', Example)
    app.component('ExampleCode', ExampleCode)
  },
} satisfies Theme
