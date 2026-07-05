import { h, mountUi } from 'tweak-ui'

export default () => {
  let value = 0
  mountUi('.example-frame', {
    view: () => [
      h('div.twk-px-2', {}, 'Checker'),
      h('div.twk-bg-checker', { style: { height: '100px' } }),

      h('div.twk-px-2', {}, 'Grid'),
      h('div.twk-bg-grid', { style: { height: '100px' } }),

      h('div.twk-px-2', {}, 'Axis'),
      h('div.twk-bg-grid-axis', { style: { height: '100px' } }),

      h('div.twk-px-2', {}, 'Dots'),
      h('div.twk-bg-dots', { style: { height: '100px' } }),

      h('div.twk-px-2', {}, 'Stripes'),
      h('div.twk-bg-stripes', { style: { height: '100px' } }),
    ],
  })
}
