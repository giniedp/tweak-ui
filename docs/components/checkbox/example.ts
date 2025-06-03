import * as TweakUi from 'tweak-ui'

export default () => {

  const context = { value: true }
  TweakUi.mount(".example-frame", (ui) => {
    ui.checkbox({ value: true, onChange: console.log })
    ui.checkbox(context, 'value')
    ui.checkbox(context, 'value', { label: 'Label' })
    ui.checkbox(context, 'value', { label: '' })
    ui.checkbox(context, 'value', { label: null, text: 'Annotation' })
  })

}
