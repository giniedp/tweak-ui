import * as TweakUi from 'tweak-ui'

export default () => {

  TweakUi.mount(".example-frame", (ui) => {
    ui.group("A Group", () => {
      ui.button("Button")
      ui.button("Button")
      ui.button("Button")
    })

    ui.group("A Group", { collapsible: true }, () => {
      ui.button("Button")
      ui.button("Button")
      ui.button("Button")
    })

    ui.group("A Group", { collapsible: true }, () => {
      ui.group("Sub group", { collapsible: true }, () => {
        ui.button("Button")
        ui.button("Button")
        ui.button("Button")
      })
      ui.group("Sub group", { collapsible: true }, () => {
        ui.button("Button")
        ui.button("Button")
        ui.button("Button")
      })
    })
  })

}
