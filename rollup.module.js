'use strict'

import config from './rollup.base'

const plugins = []
config.plugins.forEach((it) => {
  if (it.name !== 'commonjs') {
    plugins.push(it)
  }
})

export default Object.assign({}, config, {
  external: ['mithril'],
  output: {
    name: 'TweakUi',
    file: 'dist/tweak-ui.module.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: plugins,
})
