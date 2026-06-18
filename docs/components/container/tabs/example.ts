import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.tabs((tabs) => {
      ui.group('Tab 1', () => {
        ui.button('Button 1')
      })
      ui.group('Tab 2', () => {
        ui.button('Button 2')
      })
      ui.group('Tab 3', () => {
        ui.button('Button 3')
      })
    })

    ui.tabs({ vertical: true }, () => {
      ui.group('T1', () => {
        ui.button('Button 1')
      })
      ui.group('T2', () => {
        ui.button('Button 2')
      })
      ui.group('T3', () => {
        ui.button('Button 3')
      })
    })
  })
}
