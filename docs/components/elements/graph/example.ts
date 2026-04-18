import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    let time = performance.now()
    let time1 = performance.now()
    ui.group('Graph Example', { collapsible: true }, () => {
      ui.graph('Graph', {
        label: 'Example Graph',
        historySize: 300,
        collapsed: true,
        rowHeight: 30,
        rows: [
          {
            name: 'noise spikes',
            sample: () => (Math.random() < 0.02 ? 1 : 0) * 2 - 1,
          },
          {
            name: 'combined',
            sample: () => {
              const t = performance.now() / 1000
              return (
                0.5 +
                0.3 * Math.sin(t * 0.8) +
                0.1 * Math.sin(t * 3.1) +
                0.1 * (Math.random() - 0.5)
              )
            },
          },
          {
            name: 'Sigmoid loop',
            sample: () => {
              const t = performance.now() / 1000
              return 1 / (1 + Math.exp(-Math.sin(t)))
            },
          },
        ],
      })
    })
  })
}
