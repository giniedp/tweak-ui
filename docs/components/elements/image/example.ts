import { mountUi, uiImage } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.image({
      src: 'https://picsum.photos/id/893/400/300',
    })

    ui.image({
      src: 'https://picsum.photos/id/893/400/300',
      aspect: '16x9',
    })

    ui.image({
      src: 'https://picsum.photos/id/893/400/300',
      aspect: '16x9',
      width: 100,
    })

    ui.display('Image', () =>
      uiImage({
        src: 'https://picsum.photos/id/893/400/300',
        aspect: '16x9',
        width: 100,
      }),
    )
  })
}
