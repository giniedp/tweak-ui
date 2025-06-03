import * as TweakUi from 'tweak-ui'

export default () => {

  const context = { value: [1, 0, 0] }
  TweakUi.mount(".example-frame", (ui) => {
    ui.color(context, 'value', {
      label: 'Color',
      format: '[n]rgb',
      onInput: console.log
    })
  })

}
