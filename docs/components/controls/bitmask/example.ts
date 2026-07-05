import { mountUi } from 'tweak-ui'

export default () => {
  const object = {
    value: 1,
  }
  const layers = {
    layer1: 1,
    layer2: 2,
    layer3: 4,
    layer4: 8,
    layer5: 16,
  }

  mountUi('.example-frame', (ui) => {
    ui.bitmask(object, 'value', {
      bitCount: 8,
      names: layers,
    })

    // ui.number(object, 'value', {
    //   label: '',
    //   degree: true,
    //   onchange: console.log,
    // })
    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
