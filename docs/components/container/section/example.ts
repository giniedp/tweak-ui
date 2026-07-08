import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.section({ style: { height: '16rem' } }, () => {
      ui.sectionHeader({ class: 'twk-bg-300 twk-p-2' }, () => {
        ui.view(() => 'Header')
      })

      ui.group('Settings', () => {
        ui.bool({ value: true, label: 'Visible' })
        ui.string({ value: 'Hello world' })
      })

      ui.sectionFooter({ class: 'twk-bg-300 twk-p-2' }, () => {
        ui.view(() => 'Footer')
      })
    })
  })
}
