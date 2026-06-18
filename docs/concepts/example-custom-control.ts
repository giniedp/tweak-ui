import { Vnode } from 'mithril'
import { h, mountUi } from 'tweak-ui'

type EmbedAttrs = {
  src: string
  width: number
}
const embed = () => {
  return {
    view: ({ attrs }: Vnode<EmbedAttrs>) => {
      return h('embed', {
        src: attrs.src,
        width: attrs.width,
      })
    },
  }
}

export default (element: HTMLElement) => {
  mountUi(element, (b) => {
    // pushes the component with attributes to builder stack
    b.add(embed, {
      width: 220,
      src: 'https://www.youtube.com/embed/2yJgwwDcgV8?rel=0&amp;autoplay=0&mute=1',
    })

    // pushes a view function to builder stack
    b.view(() => {
      // breaks out of the builder pattern, this is pure mithriljs now.
      // and runs on every redraw, so it can be used for dynamic content.
      return h(embed, {
        width: 220,
        src: 'https://www.youtube.com/embed/2yJgwwDcgV8?rel=0&amp;autoplay=0&mute=1',
      })
    })

    // with control component wrapper, to add
    b.control(
      {
        label: 'Custom Control',
      },
      h(embed, {
        width: 220,
        src: 'https://www.youtube.com/embed/2yJgwwDcgV8?rel=0&amp;autoplay=0&mute=1',
      }),
    )
  })
}
