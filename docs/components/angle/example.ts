import * as TweakUi from 'tweak-ui'

export default () => {

  let target = { value: 0 }
  TweakUi.mount(".example-frame", (ui) => {
    console.log(document.querySelector('.example-frame'))
    ui.angle(target, 'value', {
      label: 'Angle',
    })
  })

}
