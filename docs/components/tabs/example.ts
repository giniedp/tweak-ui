import * as TweakUi from 'tweak-ui'

export default () => {

  TweakUi.mount(".example-frame", (ui) => {
    ui.tabs((tabs) => {
      ui.group("Tab 1", () => {
        ui.button("Button")
      })
      ui.group("Tab 2", () => {
        ui.number({ label: "Number" })
      })
      ui.group("Tab 3", () => {
        ui.text({ label: "Text" })
      })
    })
  })

}
