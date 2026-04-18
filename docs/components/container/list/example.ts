import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.list({ horizontal: true }, () => {
      ui.text({ value: 'Ho' })
      ui.text({ value: 'ri' })
      ui.text({ value: 'zon' })
      ui.text({ value: 'tal' })
    })

    ui.list(() => {
      ui.text({ value: 'Ver' })
      ui.text({ value: 'ti' })
      ui.text({ value: 'cal' })
    })

    ui.list({ horizontal: true }, () => {
      ui.list({ style: { flex: 'none' } }, () => {
        ui.image('Image', {
          src: 'https://picsum.photos/300/300',
          width: '4rem',
        })
      })
      ui.list(() => {
        ui.control('Button')
        ui.control('Button')
        ui.control('Button')
      })
    })
  })
}
