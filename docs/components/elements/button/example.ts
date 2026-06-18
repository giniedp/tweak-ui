import { mountUi } from 'tweak-ui'

export default () => {
  let value = 0
  mountUi('.example-frame', (ui) => {
    ui.button('Button +1', { onclick: () => value++ })
    ui.button('Button -1', { onclick: () => value-- })
    ui.button('Button reset', { onclick: () => (value = 0) })
    ui.divider()
    ui.display('Value', () => value)
  })
}
