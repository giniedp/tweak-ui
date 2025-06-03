import * as TweakUi from 'tweak-ui'

export default () => {

  const context = { value: '#fff' }
  TweakUi.mount(".example-frame", (ui) => {
    ui.colorPicker(context, 'value', {
      label: 'Color',
      onInput: console.log,
      onChange: console.log,
    })
  })

}
