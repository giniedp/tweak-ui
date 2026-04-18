import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    console.log('BUILDING UI')
    ui.group('A Group', () => {
      ui.control('Button')
      ui.control('Button')
      ui.control('Button')
    })

    ui.group('A Group', { collapsible: true }, () => {
      ui.control('Button')
      ui.control('Button')
      ui.control('Button')
    })

    ui.group('A Group', { collapsible: true }, () => {
      ui.group('Sub group', { collapsible: true }, () => {
        ui.control('Button')
        ui.control('Button')
        ui.control('Button')
      })
      ui.group('Sub group', { collapsible: true }, () => {
        ui.control('Button')
        ui.control('Button')
        ui.control('Button')
      })
    })
  })
}
