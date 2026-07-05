import { mountUi } from 'tweak-ui'

export default () => {
  mountUi('.example-frame', (ui) => {
    ui.grid({ columns: 3 }, () => {
      ui.button('Button')
      ui.button('Button')
      ui.button('Button')
      ui.button('Button')
      ui.button('Button')
      ui.button('Button')
      ui.button('Button', { style: { gridColumn: '1 / -1' } })
    })
  })
}
