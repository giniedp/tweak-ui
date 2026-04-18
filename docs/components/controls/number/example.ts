import { mountUi } from 'tweak-ui'

export default () => {
  const object = { a: 10, b: 5, c: 0.5 }
  mountUi('.example-frame', (ui) => {
    ui.number(object, 'a')
    ui.number(object, 'b', { min: 1, max: 100, step: 0.5, label: 'Range' })
    ui.number(object, 'c', { slider: true, label: 'Slider' })
    ui.number({ value: 5, label: 'Unbound' })
    ui.control('JSON', () => JSON.stringify(object, null, 2))
  })
}
