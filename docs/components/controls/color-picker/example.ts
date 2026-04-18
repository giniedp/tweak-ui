import { mountUi } from 'tweak-ui'

export default () => {
  const object = {
    hex: '#fff',
    rgb: { r: 255, g: 255, b: 255 },
    vec: { x: 1, y: 1, z: 1 },
  }
  mountUi('.example-frame', (ui) => {
    ui.colorPicker(object, 'hex', {
      label: 'Color',
      format: '#rgb',
      onInput: console.log,
      onChange: console.log,
    })
    ui.colorPicker(object, 'rgb', {
      label: 'Object with r,g,b',
      format: '{}rgb',
      onInput: console.log,
      onChange: console.log,
    })
    ui.colorPicker(object, 'vec', {
      label: 'Object with x,y,z',
      format: '{n}rgb',
      onInput: console.log,
      onChange: console.log,
    })
    ui.control('JSON', () => JSON.stringify(object, null, 2))
  })
}
