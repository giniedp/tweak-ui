import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.grid({ columns: 3 }, () => {
      ui.control('Button')
      ui.control('Button')
      ui.control('Button')
      ui.control('Button')
      ui.control('Button')
      ui.control('Button')
    })
  })
}
