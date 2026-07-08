import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.split({ style: { height: '20rem' }, flow: 'row', minSize: 80 }, () => {
      ui.splitContent({ class: 'twk-bg-300' }, () => {
        ui.group('Sidebar', () => {
          ui.bool({ value: true, label: 'Visible' })
          ui.bool({ value: false, label: 'Locked' })
        })
      })

      ui.split({}, () => {
        ui.splitContent({ class: 'twk-bg-200' }, () => {
          ui.group('Editor', () => {
            ui.widget(false, 'Hello World')
          })
        })

        ui.splitContent({ class: 'twk-bg-100', fluid: true }, () => {
          ui.group('Console', () => {
            ui.pre(false, 'Fluid pane: grows to fill remaining space')
          })
        })
      })
    })
  })
}
