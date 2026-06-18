import { mountUi } from 'tweak-ui'
export default () => {
  const object = {
    value: { x: 0, y: 0 },
  }

  mountUi('.example-frame', (ui) => {
    ui.point(object, 'value', {
      rangeX: [-1, 1],
      rangeY: [-1, 1],
      reset: [0, 0],
      snap: 0.1,
    })
    ui.pre('JSON', () => JSON.stringify(object, null, 2))
  })
}
