import * as TweakUi from 'tweak-ui'

export default () => {

  TweakUi.mount(".example-frame", (ui) => {
    ui.button('Button', { onClick: console.log })
    ui.button('Button', { label: 'With Label' })
    ui.button('Button', { label: '' })
  })

}
