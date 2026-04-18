import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.image('Image', {
      src: 'https://picsum.photos/id/893/400/300',
    })

    ui.image('Image', {
      src: 'https://picsum.photos/id/893/400/300',
      aspect: '16x9',
    })

    ui.image('Image', {
      src: 'https://picsum.photos/id/893/400/300',
      aspect: '16x9',
      width: 100,
    })
  })
}
