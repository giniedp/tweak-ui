import { mountUi } from 'tweak-ui'

export default () => {

  const object = {
    stringProp: "Hello",
    numberProp: 42,
    booleanProp: true,
  }

  mountUi(".example-frame", (ui) => {
    ui.object("A Group", object)
  })

}
