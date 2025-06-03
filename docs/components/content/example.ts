import * as TweakUi from 'tweak-ui'

export default () => {

  TweakUi.mount(".example-frame", (ui) => {
    ui.content("Text", `
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
      sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
    `)
    ui.content("HTML", TweakUi.h.trust(`
      <i onclick="alert('hijacked')">Dont do this for untrusted input</i>
    `))
    ui.content("Mithril", TweakUi.h('a', {
      target: "_blank",
      href: "https://mithril.js.org/"
    }, 'this is a mithril link'))
  })

}
