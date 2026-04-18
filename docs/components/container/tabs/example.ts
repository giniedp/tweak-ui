import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.tabs((tabs) => {
      ui.group('Tab 1', () => {
        ui.control('Button')
      })
      ui.group('Tab 2', () => {
        ui.number({ label: 'Number' })
      })
      ui.group('Tab 3', () => {
        ui.text({ label: 'Text' })
      })
    })
  })
}
