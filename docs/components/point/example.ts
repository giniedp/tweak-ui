import * as TweakUi from 'tweak-ui'

export default () => {

  const object = {
    value: { x: 0, y: 0 }
  }
  TweakUi.mount(".example-frame", (ui) => {
    ui.point(object, 'value', {
      xRange: [-1, 1],
      yRange: [-1, 1],
      reset: [0, 0],
      snap: 0.1,
    })
  })

}
