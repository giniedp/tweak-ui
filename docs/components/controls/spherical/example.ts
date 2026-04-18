import { mountUi } from 'tweak-ui'

export default () => {
  const object = { value: { x: 0, y: 0, z: 0 } }
  mountUi('.example-frame', (ui) => {
    ui.spherical(object, 'value', {
      label: 'Spherical',
      degree: true,
      onInput: console.log,
    })
    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
