import * as TweakUi from 'tweak-ui'

export default () => {

  const context = { a: 10, b: 5 }
  TweakUi.mount(".example-frame", (ui) => {
    ui.number(context, 'a')
    ui.number(context, 'b', { min: 1, max: 100, step: 0.5 })
  })

}
