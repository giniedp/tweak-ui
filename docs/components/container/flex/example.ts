import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.flex({ flow: 'row' }, () => {
      ui.stringInput({ value: 'Ho' })
      ui.stringInput({ value: 'ri' })
      ui.stringInput({ value: 'zon' })
      ui.stringInput({ value: 'tal' })
    })

    ui.flex(() => {
      ui.stringInput({ value: 'Ver' })
      ui.stringInput({ value: 'ti' })
      ui.stringInput({ value: 'cal' })
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
      ui.button('Left')
      ui.flex({ flow: 'row' }, () => {
        ui.string({ label: 'Label', value: 'Input' })
      })
      ui.button('Right')
    })
  })
}
