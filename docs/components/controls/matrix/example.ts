import { mountUi } from 'tweak-ui'
export default () => {
  const object = {
    mat4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mat3: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  }

  mountUi('.example-frame', (ui) => {
    ui.matrix(object, 'mat4', {
      label: 'Mat4',
      rows: 4,
      cols: 4,
    })

    ui.matrix(object, 'mat3', {
      label: 'Mat3',
      rows: 3,
      cols: 3,
    })

    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
