import { mountUi } from 'tweak-ui'

export default () => {
  const object = {
    value: 50,
  }
  mountUi('.example-frame', (ui) => {
    ui.angle(object, 'value', {
      label: 'Angle',
      degree: true,
      onchange: console.log,
      description: 'A control with custom label',
    })
    ui.angle(object, 'value', {
      label: '',
      degree: true,
      onchange: console.log,
      description: 'A control with no label',
    })
    ui.angle(object, 'value', {
      label: 'Min Max Step',
      degree: true,
      min: -90,
      max: 90,
      step: 15,
      onchange: console.log,
      description: 'A control with min max and step',
    })
    ui.number(object, 'value', {
      label: '',
      degree: true,
      onchange: console.log,
      description: 'connected number control',
    })
    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
