import { mountUi } from 'tweak-ui'

export default () => {
  const object = {
    hex: '#fff',
    rgb: { r: 255, g: 255, b: 255 },
    vec: { x: 1, y: 1, z: 1 },
  }
  mountUi('.example-frame', (ui) => {
    ui.color(object, 'hex', {
      label: 'Color #rgb',
      format: '#rgb',
      oninput: console.log,
      onchange: console.log,
      description: 'A color control with hex format',
    })
    ui.color(object, 'rgb', {
      label: 'Color {}rgb',
      format: '{}rgb',
      oninput: console.log,
      onchange: console.log,
      description: 'Controls an object with r, g, b fields',
    })
    ui.color(object, 'vec', {
      label: 'Color {n}xyz',
      format: '{n}xyz',
      oninput: console.log,
      onchange: console.log,
      description: 'Controls an object with x, y, z fields',
    })
  })
}
