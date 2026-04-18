import { Vnode } from 'mithril'
import { h, mountUi } from 'tweak-ui'

type EmbedAttrs = {
  src: string
  width: number
}
const embed = () => {
  return {
    view: (node: Vnode<EmbedAttrs>) => {
      const attrs = node.attrs
      return h('embed', {
        src: attrs.src,
        width: attrs.width,
      })
    },
  }
}

export default (element: HTMLElement) => {
  mountUi(element, (ui) => {
    ui.control('Custom Control', () => {
      // breaks out of the builder pattern, this is pure mithriljs now
      return h(embed, {
        width: 220,
        src: 'https://www.youtube.com/embed/2yJgwwDcgV8?rel=0&amp;autoplay=0&mute=1',
      })
    })
  })
}
