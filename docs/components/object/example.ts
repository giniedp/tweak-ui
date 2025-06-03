import * as TweakUi from 'tweak-ui'

export default () => {

  const target = {
    stringProp: "Hello",
    numberProp: 42,
    booleanProp: true,
  }

  TweakUi.mount(".example-frame", (ui) => {
    ui.object("A Group", target)
  })

}
