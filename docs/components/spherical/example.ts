import * as TweakUi from 'tweak-ui'

export default () => {

  const context = { value: { phi: 0, theta: 0 } }
  const context2 = { value: [0, 0, -1] }
  TweakUi.mount(".example-frame", (ui) => {
    ui.spherical(context, 'value', {
      label: 'Spherical',
      // degree: true,
      onInput: console.log
    })

    ui.spherical(context2, 'value', {
      label: 'Spherical',
      codec: TweakUi.sphericalCodec({
        axes: { 0: 'right', 1: 'up', 2: 'back'},
        length: -1,
        result: () => []
      }),
      onInput: console.log
    })
  })

}
