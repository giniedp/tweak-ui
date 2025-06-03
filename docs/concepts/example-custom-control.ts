import * as TweakUi from 'tweak-ui'

TweakUi.component<any>("embed", (node) => {
  const data = node.attrs.data
  return {
    view: () => {
      return TweakUi.h('embed', {
        src: data.src,
        width: data.width,
        height: data.height
      })
    }
  }
})

export default (element: HTMLElement) => {

  TweakUi.mount(element, [{
    type: "embed",
    label: "Youtube",
    width: 220,
    src: [
      "https://www.youtube.com/embed/2yJgwwDcgV8",
      "?rel=0&amp;autoplay=0&mute=1"
    ].join("")
  }])

}
