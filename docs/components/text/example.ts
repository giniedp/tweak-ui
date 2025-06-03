import * as TweakUi from 'tweak-ui'

export default () => {

  const context = { value: 'Helloo World' }
  TweakUi.mount(".example-frame", (ui) => {
    ui.text(context, 'value', {
      label: "Text",
      onInput: console.log
    })
  })

}
