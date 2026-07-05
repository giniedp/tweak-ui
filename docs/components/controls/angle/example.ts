import { mountUi, uiAngleWidget } from 'tweak-ui'

export default () => {
  const object = {
    degree: 50,
    rad: 0.5,
    get() {
      return 'foo'
    },
    set(val: string) {},
  }

  mountUi('.example-frame', (ui) => {
    ui.angle(object, 'degree', {
      label: 'Degree',
      degree: true,
      onchange: console.log,
    })
    ui.angle(object, 'rad', {
      label: 'Rad',
      onchange: console.log,
    })
    ui.angle(object, 'degree', {
      label: '',
      degree: true,
      onchange: console.log,
    })
    ui.angle(object, 'degree', {
      label: 'Degree with min/max/step',
      degree: true,
      min: -90,
      max: 90,
      step: 15,
      onchange: console.log,
    })
    ui.angle(object, 'rad', {
      label: 'Rad with min/max/step',
      min: -Math.PI,
      max: Math.PI,
      step: Math.PI / 4,
      onchange: console.log,
    })
    ui.angle(object, 'degree', {
      label: 'Readonly',
      degree: true,
      readonly: true,
    })

    // ui.number(object, 'value', {
    //   label: '',
    //   degree: true,
    //   onchange: console.log,
    // })
    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
