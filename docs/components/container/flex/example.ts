import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.flex({ flow: 'row' }, () => {
      ui.string({ value: 'Ho' })
      ui.string({ value: 'ri' })
      ui.string({ value: 'zon' })
      ui.string({ value: 'tal' })
    })

    ui.flex(() => {
      ui.string({ value: 'Ver' })
      ui.string({ value: 'ti' })
      ui.string({ value: 'cal' })
    })

    ui.flex({ flow: 'row' }, () => {
      ui.flex({ style: { flex: 'none' } }, () => {
        ui.image({
          src: 'https://picsum.photos/300/300',
          width: '4rem',
        })
      })
      ui.flex(() => {
        ui.button('Button')
        ui.button('Button')
        ui.button('Button')
      })
    })

    ui.flex({ flow: 'row' }, () => {
      ui.button('Left', { style: { flex: 'none' } })
      ui.flex({ flow: 'row' }, () => {
        ui.input({ label: 'Content', value: 'Line 1', type: 'password' })
      })
      ui.button('Right', { style: { flex: 'none' } })
    })
  })
}
