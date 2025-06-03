import * as TweakUi from 'tweak-ui'

export default () => {

  TweakUi.mount(".example-frame", (ui) => {
    ui.container({ horizontal: true }, () => {
      ui.container({ style: { flex: 'none' } }, () => {
        ui.image("Image", {
          src: "https://picsum.photos/300/300",
          width: '4rem'
        })
      })

      ui.container(() => {
        ui.button("Button", { label: "Label" })
        ui.button("Button", { label: "Label" })
        ui.button("Button", { label: "Label" })
      })
    })
  })

}
