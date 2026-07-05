import { mountUi } from 'tweak-ui'

export default () => {
  const object = { a: 10, b: 5, c: 0.5 }
  mountUi('.example-frame', (ui) => {
    ui.group(() => {
      ui.scalar(object, 'a')
      ui.scalar(object, 'b', { min: 1, max: 100, step: 0.5, label: 'Range, no indicator' })
      ui.scalar(object, 'b', { min: 1, max: 100, step: 0.5, label: 'Range indicator', range: true })
      ui.scalar({ value: 5, label: 'Static', unit: 'px' })
      ui.scalar({ value: 50, label: 'Readonly', readonly: true, unit: 'FPS' })

      ui.pre('JSON', () => JSON.stringify(object, null, 2))
    })
  })
}
